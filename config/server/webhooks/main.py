from flask import Flask, request, Response
from subprocess import run
import logging

PORT = 8080
TRACKED_BRANCHES = ('dev')

logging.basicConfig(
    filename='log.txt',
    level=logging.INFO,
    format='WebhookListener %(asctime)s %(levelname)-8s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

app = Flask(__name__)

@app.route('/git-push', methods=['POST'])
def respond():
    try:
        gitHeader = request.headers['X-GitHub-Event']
        if gitHeader != 'push':
            logging.info('Non-push git action detected.')
            return Response(status=200, response='Request intentionally ignored.')

        data = request.json
        logging.info('Git push detected. {} new commit(s) pushed to {} by {}.'.format(len(data.commits), data.ref, data.pusher.name))

        if not data.ref.startswith('refs/head/'):
            logging.info('Push message format not as expected')
            return Response(status=400, response='Push message format not as expected')

        branch = data.ref[len('refs/head/'):]
        if branch not in TRACKED_BRANCHES:
            logging.info('Push was not to tracked branch. No further action will be taken.')
            return Response(status=200, response='Push was not to tracked branch. No further action will be taken.')

        logging.info('Stopping old server processes...')
        result = run('/home/student/dev/config/server/scripts/stop.sh')
        if result.returncode != 0:
            logging.error('Failed to stop old processes. Exit code {}'.format(result.returncode))
            return Response(status=500, response='Failed to stop old processes. Exit code {}'.format(result.returncode))

        logging.info('Pulling latest changes...')
        result = run('/home/student/dev/config/server/scripts/update.sh ' + branch)
        if result.returncode != 0:
            logging.error('Failed to pull from repo. Exit code {}'.format(result.returncode))
            return Response(status=500, response='Failed to pull from repo. Exit code {}'.format(result.returncode))

        logging.info('Building files...')
        result = run('/home/student/dev/config/server/scripts/build.sh ' + branch)
        if result.returncode != 0:
            logging.error('Failed to build frontend/backend. Exit code {}'.format(result.returncode))
            return Response(status=500, response='Failed to build frontend/backend. Exit code {}'.format(result.returncode))

        logging.info('Starting server...')
        result = run('/home/student/dev/config/server/scripts/run.sh ' + branch)
        logging.info('Started sever.')

        return Response(status=200, response='Server updated successfully.')

    except e:
        logging.error(e)
        logging.info('Headers: {}'.format(request.headers))
        logging.info('Payload: {}'.format(request.json))
        return Response(status=500, response='Request missing GitHub headers, or has malformed payload.')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)
