import { Divider, Typography } from '@material-ui/core';
import { PageRender } from './api/serverSideProps';

export default function About() {
  const om = 'Om prosjektet';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '50px 20vw',
      }}
    >
      <Typography variant="h3">{om}</Typography>
      <Divider />
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps(context) {
  const propsData = PageRender('index', context);
  return propsData;
}
