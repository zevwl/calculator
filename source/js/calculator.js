class Calculator {

  constructor(window, sum) {
    this.window = window;
    this.sum = sum;
  }

  append(num) {
    this.window.value += num;
  }

  replace(num) {
    this.window.value = num;
  }
}