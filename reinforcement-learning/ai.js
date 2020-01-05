class Brain {
  constructor() {
    this.model = tf.sequential({
      layer: [tf.layers.dense({ inputShape: [] })]
    });
  }
}
