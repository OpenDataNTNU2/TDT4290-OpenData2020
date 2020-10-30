import { Divider, Typography } from '@material-ui/core';
import { PageRender } from './api/serverSideProps';
import * as content from '../utils/About.json';

export default function About() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '3% 20vw',
      }}
    >
      <Typography variant="h4">{content.title}</Typography>
      <Divider style={{ marginTop: '1%', marginBottom: '2%' }} />
      <Typography paragraph>{content.us}</Typography>
      <Typography paragraph>{content.content}</Typography>
      <Typography>
        <a href="https://xn--sampne-kua.no/om/">{content.link}</a>
      </Typography>
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps(context) {
  const propsData = PageRender('index', context);
  return propsData;
}
