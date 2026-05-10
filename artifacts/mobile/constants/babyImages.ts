export const BABY_IMAGES = [
  require("../assets/images/baby_result_1.png"),
  require("../assets/images/baby_result_2.png"),
  require("../assets/images/baby_result_3.png"),
];

export const getRandomBabyImageIndex = () =>
  Math.floor(Math.random() * BABY_IMAGES.length);
