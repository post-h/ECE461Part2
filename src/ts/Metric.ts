export interface Metric {
    calcMetric: () => Promise<number>;

}
