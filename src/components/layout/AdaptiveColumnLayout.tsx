import React from 'react'

import Box from '@mui/joy/Box'
import Grid from '@mui/joy/Grid'
import Tabs from '@mui/joy/Tabs'
import TabList from '@mui/joy/TabList'
import TabPanel from '@mui/joy/TabPanel'
import Tab from '@mui/joy/Tab'

import useMediaQuery from '@/hooks/useMediaQuery'

import ControlBlock from '../ControlBlock'

const classes = {
  tabsContainer: {
    height: 1,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 1
  },
  tabRow: {
    flex: 1,
    minHeight: 0
  },
  tabPanel: {
    height: 1,
    p: 0,
    overflow: 'hidden'
  },
  tabContent: {
    height: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  },

  gridContainer: {
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    height: 1,
    minHeight: 0
  },
  grid: {
    flex: 1,
    maxHeight: 1,
    ['& > *']: {
      maxHeight: 1
    }
  }
}

type AdaptiveColumnLayoutProps = React.PropsWithChildren & {
  entries: Record<string, React.ReactNode>

  cols: number
  space: number[]

  defaultEntry: number
}

function AdaptiveColumnLayout(props: AdaptiveColumnLayoutProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return isMobile ? (
    <Box sx={classes.tabsContainer}>
      <Tabs defaultValue={props.defaultEntry} sx={classes.tabRow}>
        <TabList tabFlex="auto" sticky="top">
          {Object.keys(props.entries).map((title, i) => (
            <Tab key={i} value={i} color="primary">
              {title.toUpperCase()}
            </Tab>
          ))}
        </TabList>
        {Object.values(props.entries).map((node, i) => (
          <TabPanel key={i} value={i} sx={classes.tabPanel}>
            <Box sx={classes.tabContent}>{node}</Box>
          </TabPanel>
        ))}
      </Tabs>
      {props.children}
    </Box>
  ) : (
    <Box sx={classes.gridContainer}>
      <Grid container columns={props.cols} spacing={1} sx={classes.grid}>
        {Object.entries(props.entries).map(([title, node], i) => (
          <Grid key={i} xs={props.space[i]}>
            <ControlBlock title={title}>{node}</ControlBlock>
          </Grid>
        ))}
      </Grid>
      {props.children}
    </Box>
  )
}

const AdaptiveColumnLayoutMemoized = React.memo(AdaptiveColumnLayout)
export default AdaptiveColumnLayoutMemoized
