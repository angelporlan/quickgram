import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, LottieComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  grammarOptions: AnimationOptions = {
    path: '/svg-lottie/grammar.json',
    loop: true,
    autoplay: false
  };

  vocabularyOptions: AnimationOptions = {
    path: '/svg-lottie/vocabulary.json',
    loop: true,
    autoplay: false
  };

  readingOptions: AnimationOptions = {
    path: '/svg-lottie/reading.json',
    loop: true,
    autoplay: false
  };

  listeningOptions: AnimationOptions = {
    path: '/svg-lottie/listening.json',
    loop: true,
    autoplay: false
  };

  writingOptions: AnimationOptions = {
    path: '/svg-lottie/writting.json',
    loop: true,
    autoplay: false
  };

  useOfEnglishOptions: AnimationOptions = {
    path: '/svg-lottie/use-of-english.json',
    loop: true,
    autoplay: false
  };

  private animationItems: { [key: string]: AnimationItem } = {};

  onAnimationCreated(animationItem: AnimationItem, category: string): void {
    this.animationItems[category] = animationItem;
  }

  onHover(category: string): void {
    if (this.animationItems[category]) {
      this.animationItems[category].play();
    }
  }

  onLeave(category: string): void {
    if (this.animationItems[category]) {
      this.animationItems[category].stop();
    }
  }
}
