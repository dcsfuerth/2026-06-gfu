/**
 * Gemeinsames Setup für die Unit-Tests.
 *
 * jsdom implementiert `HTMLDialogElement.showModal()`/`close()` nicht.
 * Dieser minimale Polyfill bildet das `open`-Attribut und das `close`-Event
 * nach, damit Komponenten mit nativem <dialog> testbar sind.
 */
const dialogPrototype = HTMLDialogElement.prototype;

if (typeof dialogPrototype.showModal !== 'function') {
  dialogPrototype.showModal = function (this: HTMLDialogElement): void {
    this.setAttribute('open', '');
  };
}

if (typeof dialogPrototype.close !== 'function') {
  dialogPrototype.close = function (this: HTMLDialogElement, returnValue?: string): void {
    if (!this.open) {
      return;
    }
    if (returnValue !== undefined) {
      this.returnValue = returnValue;
    }
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}
