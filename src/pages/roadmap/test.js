import React from 'react';
import Layout from '@theme/Layout';
import { makeStyles } from '@material-ui/core/styles';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@material-ui/lab';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  timeline: {
    marginTop: theme.spacing(3),
  },
  timelineYear: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
  },
  timelineDescription: {
    color: theme.palette.secondary.main,
    marginBottom: theme.spacing(2),
  },
  timelineDot: {
    boxShadow: `0 0 0 4px ${theme.palette.background.paper}`,
  },
  timelineConnector: {
    backgroundColor: theme.palette.primary.main,
    height: '100%',
    marginLeft: theme.spacing(-0.75),
    marginRight: theme.spacing(-0.75),
  },
}));

const Roadmap = () => {
  const classes = useStyles();

  return (
    <Timeline align="alternate" className={classes.timeline}>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" className={classes.timelineDot} />
          <TimelineConnector className={classes.timelineConnector} />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="h6" className={classes.timelineYear}>2020</Typography>
          <Typography className={classes.timelineDescription}>First milestone achieved</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" className={classes.timelineDot} />
          <TimelineConnector className={classes.timelineConnector} />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="h6" className={classes.timelineYear}>2021</Typography>
          <Typography className={classes.timelineDescription}>Second milestone achieved</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" className={classes.timelineDot} />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="h6" className={classes.timelineYear}>2022</Typography>
          <Typography className={classes.timelineDescription}>Third milestone achieved</Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
};

export default function Hello() {
  return (
    <Layout title="Hello" description="Hello React Page">
      <Roadmap />
    </Layout>
  );
}
