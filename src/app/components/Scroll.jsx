"use client"

import { setupMarqueeAnimation } from '../marquee';
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
import React, { useRef } from 'react'
import Image from 'next/image'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

const Page = () => {
    const containerRef = useRef();
    useGSAP(() => {
      gsap.registerPlugin(ScrollTrigger, SplitText);

      const lenis = new Lenis ();
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      const cards = gsap.utils.toArray(".card");
      const introCard = cards[0];

      const titles = gsap.utils.toArray(".card-title h1");
      titles.forEach((title) => {
        const split = new SplitText(title, {
          type: "char",
          charsClass: "char",
          tag: "div",
        });
        split.chars.forEach((char) => {
          char.innerHTML = `<span>${char.textContent}</span>`;
        });
      });

      const cardImgWrapper = introCard.querySelector(".card-img");
      const cardImg = introCard.querySelector(".card-img img");
      gsap.set(cardImgWrapper, {scale: 0.5, borderRadius: "400px"});
      gsap.set(cardImg, {scale: 1.5});

      function animateContentIn(titleChar, description){
        gsap.to(titleChar, {x: "0%", duration: 0.75, ease: "power4.out"});
        gsap.to(description, {
          x: 0,
          opacity: 1,
          duration: 0.75,
          delay: 0.1,
          ease: "power4.out"
        })
      }
      function animateContentOut(titleChar, description){
        gsap.to(titleChar, {x: "100%", duration: 0.5, ease: "power4.out"});
        gsap.to(description, {
          x: "40px",
          opacity: 0,
          duration: 0.5,
          ease: "power4.out"
        });
      }

      const marquee = introCard.querySelector(".card-marquee .marquee");
      const titleChars = introCard.querySelector(".char span");
      const description = introCard.querySelector(".card-description");

      ScrollTrigger.create({
        trigger: introCard,
        start: "top top",
        end: "+=300vh",
        onUpdate: (self) => {
          const progress = self.progress;
          const imgScale = 0.5 + progress * 0.5;
          const borderRadius = 400 - progress * 375;
          const innerImgScale = 1.5 - progress * 0.5;

          gsap.set(cardImgWrapper, {
            scale: imgScale,
            borderRadius: borderRadius + "px",
          });
          gsap.set(cardImg, {scale: innerImgScale})

          if(imgScale >= 0.5 && imgScale <= 0.75){
            const fadeProgress = (imgScale - 0.5) / (0.75 - 0.5);
            gsap.set(marquee, {opacity: 1 - fadeProgress});
          }else if (imgScale < 0.5){
            gsap.set(marquee, {opacity: 1});
          }else if(imgScale > 0.75){
            gsap.set(marquee, {opacity: 0});
          }

          if(progress >= 1 && !introCard.containerRevealed){
            introCard.containerRevealed = true;
            animateContentIn(titleChars, description);
          }
          if(progress < 1 && introCard.containerRevealed){
            introCard.contentRevealed = false;
            animateContentOut(titleChars, description)
          }
        }
      });

      cards.forEach((card, index) => {
        const isLastCard = index === cards.length - 1;
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          end: isLastCard ? "+=100vh" : "top top",
          endTrigger: isLastCard ? null : cards[cards.length -1],
          pin: true,
          pinSpacing: isLastCard,
        });
      });

      cards.forEach((card, index) => {
        if(index < cards.length -1) {
          const cardWrapper = card.querySelector(".card-wrapper");
          ScrollTrigger.create({
            trigger: cards[index + 1],
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.set(cardImgWrapper, {
                scale: 1 - progress * 0.25,
                opacity: 1 - progress,
              })
            }
          })
        }
      });

      cards.forEach((card, index) => {
        if(index > 0){
          const cardImg = card.querySelector(".card-img img");
          const imgContainer = card.querySelector(".card-img");
          ScrollTrigger.create({
            trigger: card,
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.set(cardImg, {
                scale: 2 - progress
              })
              gsap.set(imgContainer, {borderRadius: 150 - progress * 125 + "px"});
            }
          })
        }
      });

      cards.forEach((card, index) => {
        if(index === 0) return;

        const cardDescription = card.querySelector(".card-description");
        const cardTitleChars = card.querySelectorAll(".char span");

        ScrollTrigger.create({
          trigger: card,
          onEnter: () => animateContentIn(cardTitleChars, cardDescription),
          onLeaveBack: () => animateContentOut(cardTitleChars, cardDescription),
        })
      });

      setupMarqueeAnimation();
    }, {scope: containerRef})
  return (
    <section ref={containerRef}>
        <div className='cards'>
          <div className='card'>
            <div className="card-marquee">
              <div className="marquee">
                <h1>Bali is the vibe.</h1>
                <h1>Freedom lives here.</h1>
                <h1>Joy feels natural.</h1>
                <h1>Love flows everywhere.</h1>
              </div>
            </div>
            <div className='card-wrapper'>
              <div className='card-content'>
                <div className="card-title"><h1>Uluwatu Temple</h1></div>
                <div className="card-description"><p>A stunning sea temple perched atop a steep cliff on Bali’s southwestern coast. Known for its dramatic sunsets and traditional Kecak fire dance performances, it’s a must-visit for cultural and spiritual experiences.</p></div>
              </div>
              <div className="card-img relative h-screen">
                <Image fill src="/images/img1.jpg" alt="Bali" className='img'/>
              </div>
            </div>
          </div>
          <div className='card'>
            <div className='card-wrapper'>
              <div className='card-content'>
                <div className="card-title"><h1>Tegallalang Rice Terraces</h1></div>
                <div className="card-description">Located near Ubud, these iconic rice paddies are a symbol of Bali’s natural beauty. The lush green terraces, created using the subak irrigation system, offer breathtaking views and photo opportunities.</div>
              </div>
              <div className="card-img relative h-screen">
                <Image fill src="/images/img2.jpg" alt="Bali" className='img'/>
              </div>
            </div>
          </div>
          <div className='card'>
            <div className='card-wrapper'>
              <div className='card-content'>
                <div className="card-title"><h1>Mount Batur</h1></div>
                <div className="card-description"><p>An active volcano that draws early-morning hikers aiming to catch the sunrise from its summit. The trek is moderately challenging, but the panoramic views of Lake Batur and the surrounding highlands are truly rewarding</p></div>
              </div>
              <div className="card-img relative h-screen">
                <Image fill src="/images/img3.jpg" alt="Bali" className='img'/>
              </div>
            </div>
          </div>
          <div className='card'>
            <div className='card-wrapper'>
              <div className='card-content'>
                <div className="card-title"><h1>Nusa Penida</h1></div>
                <div className="card-description"><p>A rugged island southeast of Bali, famous for its dramatic cliffs, crystal-clear waters, and spots like Kelingking Beach. Ideal for adventurers, divers, and anyone looking to explore untouched natural beauty</p></div>
              </div>
              <div className="card-img relative h-screen">
                <Image fill src="/images/img4.jpg" alt="Bali" className='img'/>
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}

export default Page