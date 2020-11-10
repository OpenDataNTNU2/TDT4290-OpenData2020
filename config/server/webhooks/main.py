from flask import Flask, request, Response
from subprocess import run
import logging
import threading
import atexit

PORT = 8080
TRACKED_BRANCHES = ('dev')
threads = []

logging.basicConfig(
    filename='log.txt',
    level=logging.INFO,
    format='WebhookListener %(asctime)s %(levelname)-8s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

class serverUpdateRunner (threading.Thread):
    def __init__(self, branch):
        threading.Thread.__init__(self)
        self.branch = branch

    def run(self):
        threads.append(self)
        branch = self.branch

        logging.info('Stopping old server processes...')
        result = run('/home/student/dev/config/server/scripts/stop.sh')
        if result.returncode != 0:
            logging.error('Failed to stop old processes. Exit code {}'.format(result.returncode))
            return

        logging.info('Pulling latest changes...')
        result = run(['/home/student/dev/config/server/scripts/update.sh', branch])
        if result.returncode != 0:
            logging.error('Failed to pull from repo. Exit code {}'.format(result.returncode))
            return

        logging.info('Building files...')
        result = run(['/home/student/dev/config/server/scripts/build.sh', branch])
        if result.returncode != 0:
            logging.error('Failed to build frontend/backend. Exit code {}'.format(result.returncode))
            return

        logging.info('Starting server...')
        result = run(['/home/student/dev/config/server/scripts/run.sh', branch])
        logging.info('Started sever.')
        return

def join_threads():
    for thread in threads:
        thread.join()

atexit.register(join_threads)

app = Flask(__name__)

@app.route('/git-push', methods=['POST'])
def respond():
    try:
        gitHeader = request.headers['X-GitHub-Event']
        if gitHeader != 'push':
            logging.info('Non-push git action detected.')
            return Response(status=200, response='Request intentionally ignored.')

        data = request.json
        logging.info('Git push detected. {} new commit(s) pushed to {} by {}.'.format(len(data['commits']), data['ref'], data['pusher']['name']))

        if not data['ref'].startswith('refs/heads/'):
            logging.info('Push message format not as expected')
            return Response(status=400, response='Push message format not as expected')

        branch = data['ref'][len('refs/heads/'):]
        if branch not in TRACKED_BRANCHES:
            logging.info('Push was not to tracked branch. No further action will be taken.')
            return Response(status=200, response='Push was not to tracked branch. No further action will be taken.')

        updater = serverUpdateRunner(branch)
        updater.start()

        return Response(status=200, response='Server update started for branch {}.'.format(branch))

    except Exception as e:
        logging.error(e)
        logging.info('Headers: {}'.format(request.headers))
        logging.info('Payload: {}'.format(request.json))
        return Response(status=500, response='Request missing GitHub headers, or has malformed payload.')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)
