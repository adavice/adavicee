class LetterCycler {
    constructor(options = {}) {
      this.defaults = {
        duration: 2000,
        easing: "linear",
        letterDelay: 100,
        once: true,
      };

      this.settings = { ...this.defaults, ...options };
      this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ&".split("");
      this.animatedElements = new Map();
    }

    getLetterFrames(targetLetter) {
      targetLetter = targetLetter.toUpperCase();
      const targetIndex = this.alphabet.indexOf(targetLetter);
      return this.alphabet.slice(0, targetIndex + 1);
    }

    animateLetter(element, targetLetter) {
      if (targetLetter === " ") {
        element.textContent = " ";
        return Promise.resolve();
      }

      const frames = this.getLetterFrames(targetLetter);
      const frameTime = this.settings.duration / frames.length;
      let currentFrame = 0;

      return new Promise((resolve) => {
        const animate = () => {
          if (currentFrame < frames.length) {
            element.textContent = frames[currentFrame];
            currentFrame++;
            setTimeout(animate, frameTime);
          } else {
            resolve();
          }
        };

        animate();
      });
    }

    animate(element, text) {
      if (this.settings.once && this.animatedElements.get(element)) {
        return;
      }

      element.textContent = "";

      const letters = text.split("").map((letter) => {
        const span = document.createElement("span");
        if (letter === " ") {
          span.textContent = " ";
        } else {
          span.textContent = " ";
        }
        element.appendChild(span);
        return { span, targetLetter: letter };
      });

      letters.forEach((letter, index) => {
        if (letter.targetLetter !== " ") {
          setTimeout(() => {
            this.animateLetter(letter.span, letter.targetLetter);
          }, index * this.settings.letterDelay);
        }
      });

      this.animatedElements.set(element, true);
    }

    observeElement(element, text) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animate(element, text);
              if (this.settings.once) {
                observer.disconnect();
              }
            }
          });
        },
        {
          threshold: 0.5,
        }
      );
      observer.observe(element);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const cycler = new LetterCycler({
      duration: 500,
      letterDelay: 150,
      once: true,
    });

    const texts = [
      { id: "text1", content: "GLOBAL" },
      { id: "text2", content: "FRAUD PROTECTION" },
      { id: "text3", content: "DIRECT&OWN" },
      { id: "text4", content: "FAST" }
    ];

    texts.forEach((text) => {
      const element = document.getElementById(text.id);
      cycler.observeElement(element, text.content);
    });
  });