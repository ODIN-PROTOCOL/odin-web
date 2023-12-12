import { ROUTE_NAMES } from '@/enums'

export const blockChainDataBlocks = [
  {
    id: 'averageOdinBlockSizeChart',
    title: 'Average ODIN Block Size Chart',
    chartType: 'bar',
    chartPageName: ROUTE_NAMES.averageOdinBlockSizeChart,
  },
  {
    id: 'averageBlockTimeChart',
    title: 'Average Block Time Chart',
    chartType: 'bar',
    chartPageName: ROUTE_NAMES.averageBlockTimeChart,
  },
];

export const blockChainDataTransactions = [
  {
    id: 'dailyTransactionsVolumeChart',
    title: 'Daily Transactions Volume Chart',
    chartType: 'line',
    chartPageName: ROUTE_NAMES.dailyTransactionsVolumeChart,
  },
  {
    id: 'averageTransactionFeeChart',
    title: 'Average Transaction Fee Chart',
    chartType: 'line',
    chartPageName: ROUTE_NAMES.averageTransactionFeeChart,
  },
]

export const blockChainDataRequests = [
  {
    id: 'averageRequestsChart',
    title: 'Total Requests Chart',
    chartType: 'line',
    chartPageName: ROUTE_NAMES.totalRequestsChart,
  },
]

export const chartPagesProps = {
  averageOdinBlockSizeChart: {
    chartPageTitle: 'Average Odin Block Size Chart',
    chartType: 'bar',
    getDataMethodName: 'getAvgSizePerDays',
    datasetLabel: 'Block Size',
    datasetUnit: 'kilobytes',
    yAxisTitle: 'Block Size in Kilobyte',
  },
  averageBlockTimeChart: {
    chartPageTitle: 'Average Block Time Chart',
    chartType: 'bar',
    getDataMethodName: 'getAvgTimePerDays',
    datasetLabel: 'Block Time',
    datasetUnit: 'sec',
    yAxisTitle: 'Block Time in Seconds',
  },
  dailyTransactionsVolumeChart: {
    chartPageTitle: 'Daily Transactions Volume Chart',
    chartType: 'line',
    getDataMethodName: 'getTxVolumePerDays',
    datasetLabel: 'Transactions',
    yAxisTitle: 'Transactions per Day',
  },
  averageTransactionFeeChart: {
    chartPageTitle: 'Average Transaction Fee Chart',
    chartType: 'line',
    getDataMethodName: 'getAvgTxFeePerDays',
    datasetLabel: 'Average Transaction Fee',
    yAxisTitle: 'Average Transaction Fee',
  },
  averageRequestsChart: {
    chartPageTitle: 'Total Requests Chart',
    chartType: 'line',
    getDataMethodName: 'getRequestsVolumePerDays',
    datasetLabel: 'Number of request',
    yAxisTitle: 'Number of requests',
  },
}
