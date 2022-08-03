export const defaultChartData = {
  labels: ['Undefined'],
  dataValues: [1],
  colors: ['#CED4DA'],
}

export const getPercentageForChartValues = (
  counts: number[],
  totalNumber: number,
): number[] => {
  return counts.map(item => {
    if (item === 0) return 0
    if (item === totalNumber) return 100

    return Math.round((item / totalNumber) * 100)
  })
}
