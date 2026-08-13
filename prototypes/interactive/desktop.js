(function () {
  "use strict";

  function render() {
    return `
      <section class="desktop-placeholder">
        <span>WhiteRabbit desktop</span>
        <h1>Command center prototype</h1>
        <p>The detailed desktop workspace lands in the next verified slice.</p>
        <button class="primary-button" data-mode="mobile">Review mobile flow</button>
      </section>`;
  }

  window.WhiteRabbitDesktop = { render, handle() {} };
})();
