/**
 *  @file highlight-copy.ts
 *  @summary Adds a copy button to highlightjs code blocks
 *  @see {@link https://github.com/highlightjs/highlight-copy/blob/master/src/highlight-copy.js}
 *  @description This file defines a class called CopyButtonPlugin that adds a copy button to highlightjs code blocks.
 *  @module highlight-copy
 */

/**
 * Adds a copy button to highlightjs code blocks
 */
class CopyButtonPlugin {
  private readonly hook: Hook;
  private readonly callback: CopyCallback;

  /**
   * Create a new CopyButtonPlugin class instance
   * @param {Object} [options] - Functions that will be called when a copy event fires
   * @param {CopyCallback} [options.callback]
   * @param {Hook} [options.hook]
   */
  constructor(options: { hook?: Hook; callback?: CopyCallback } = {}) {
    this.hook = options.hook;
    this.callback = options.callback;
  }

  /**
   * @function after:highlightElement
   * @memberof CopyButtonPlugin
   * @description Adds a copy button to the given code block element
   * @param {Object} event - The after:highlightElement event object
   * @param {HTMLElement} event.el - The code block element
   * @param {string} event.text - The text content of the code block
   * @returns {undefined}
   */
  public 'after:highlightElement'({ el, text }: { el: HTMLElement; text: string }): void {
    // Create the copy button and append it to the codeblock.
    const button = Object.assign(document.createElement('button'), {
      innerHTML: 'Copy',
      className: 'hljs-copy-button',
    });
    button.dataset['copied'] = 'false';
    el.parentElement.classList.add('hljs-copy-wrapper');
    el.parentElement.appendChild(button);

    // Add a custom property to the code block so that the copy button can reference and match its background-color value.
    el.parentElement.style.setProperty(
      '--hljs-theme-background',
      window.getComputedStyle(el).backgroundColor,
    );

    button.onclick = () => {
      if (!navigator.clipboard) return;

      let newText = text;
      if (this.hook && typeof this.hook === 'function') {
        newText = this.hook(text, el) || text;
      }

      navigator.clipboard
        .writeText(newText)
        .then(() => {
          button.innerHTML = 'Copied!';
          button.dataset['copied'] = 'true';

          const alert = Object.assign(document.createElement('div'), {
            role: 'status',
            className: 'hljs-copy-alert',
            innerHTML: 'Copied to clipboard',
          });
          el.parentElement.appendChild(alert);

          setTimeout(() => {
            button.innerHTML = 'Copy';
            button.dataset['copied'] = 'false';
            el.parentElement.removeChild(alert);
          }, 2000);
        })
        .then(() => {
          if (typeof this.callback === 'function') return this.callback(newText, el);
        });
    };
  }
}

/**
 * @typedef {function} CopyCallback
 * @memberof CopyButtonPlugin
 * @summary A function that will be called when a copy event fires
 * @param {string} text - The raw text copied to the clipboard.
 * @param {HTMLElement} el - The code block element that was copied from.
 * @returns {undefined}
 */
type CopyCallback = (text: string, el: HTMLElement) => void;

/**
 * @typedef {function} Hook
 * @memberof CopyButtonPlugin
 * @summary A function that will be called to modify the text content of the code block before it is copied to the clipboard
 * @param {string} text - The raw text copied to the clipboard.
 * @param {HTMLElement} el - The code block element that was copied from.
 * @returns {string|undefined} The modified text content of the code block
 */
type Hook = (text: string, el: HTMLElement) => string | undefined;

export default CopyButtonPlugin;
