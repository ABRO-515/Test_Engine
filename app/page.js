"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import Image from "next/image";
import { SlOptions } from "react-icons/sl";

const smallCards = [
  { icon: '/images/heart.webp', text: 'Health / Wellness', color: 'bg-blue-600 ' },
  { icon: '/images/stars.webp', text: 'Deep Jugaad', color: 'bg-red-600 hidden md:flex' },
  { icon: '/images/stars.webp', text: 'Parenting', color: 'bg-yellow-600' },
  { icon: '/images/diy.webp', text: 'DIY', color: 'bg-green-600 hidden md:flex' },
];

const userCards = [
  { user: 'Usama Khan', backGround: 'bg-white text-black hidden md:block', time: '1h Ago · Parenting', question: 'How Can I Manage Screen Time For Kids Effectively?', image: '/profile-pictures/user1.jpg' },
  { user: 'Abdul Hameed', backGround: 'bg-white text-black hidden md:block', time: '3h Ago · Parenting', question: 'How To Make Kids Interested In Studying Without Forcing Them?', image: '/profile-pictures/user2.jpg' },
  { user: 'Waiz Ali', backGround: 'bg-white text-black hidden md:block ', time: '2h Ago · Deep Jugaad', question: 'How Can I Create A Balcony Garden In A Small Space?', image: '/profile-pictures/user3.jpg' },
  { user: 'Zain Zaidi', backGround: 'bg-[#323232] text-white', time: '5h Ago · DIY', question: 'How Do I Paint My House Walls Like A Pro?', image: '/profile-pictures/user4.jpg' },
  { user: 'Uzair Abro', backGround: 'bg-white text-black ', time: '4h Ago · Tech', question: 'How Do I Become A BlockChain Developer?', image: '/profile-pictures/user5.jpg' },
  { user: 'Chadaray Aslam', backGround: 'bg-white text-black', time: '8h Ago · DIY', question: 'How To Pack More Items In A Small Bag?', image: '/profile-pictures/user1.jpg' },
  { user: 'Ajay ', backGround: 'bg-white text-black hidden md:block', time: '1h Ago · Deep Jugaad', question: 'What’s the best jugaad to cool a room without an AC?', image: '/profile-pictures/user3.jpg' },
  { user: 'M.Shahab', backGround: 'bg-[#323232] text-white hidden md:block', time: '3h Ago · Medical', question: 'What’s the best way to remove dandruff naturally?', image: '/profile-pictures/user4.jpg' },
];

export default function Test() {
  const [isVisible, setIsVisible] = useState(false);
  const sceneRef = useRef(null);
  const userCardsRef = useRef([]);
  const smallCardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sceneRef.current) {
      observer.observe(sceneRef.current);
    }

    return () => {
      if (sceneRef.current) {
        observer.unobserve(sceneRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (!sceneRef.current || !isVisible) return;

    const { Engine, Render, Runner, Bodies, Composite, Events, Mouse, MouseConstraint } = Matter;

    const engine = Engine.create();
    const width = window.innerWidth;
    const section = document.getElementById('community-section');
    const height = section ? section.offsetHeight : window.innerHeight;

    const runner = Runner.create();
    Runner.run(runner, engine);

    engine.gravity.y = 1;

    const roof = Bodies.rectangle(width / 2, -50, width, 100, { isStatic: true });
    const ground = Bodies.rectangle(width / 2, height + 100, width, 200, { isStatic: true });
    const leftWall = Bodies.rectangle(-100, height / 2, 200, height * 2, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 100, height / 2, 200, height * 2, { isStatic: true });
    
    Composite.add(engine.world, [ground, leftWall, rightWall]);

    userCards.forEach((card, index) => {
      const cardElement = userCardsRef.current[index]?.el;
      if (cardElement) {
        const width = cardElement.offsetWidth;
        const height = cardElement.offsetHeight;
        const body = Bodies.rectangle(
          Math.random() * window.innerWidth,
          -Math.random() * 400,
          width,
          height,
          {
            restitution: 0.7,
            friction: 0.3,
            label: `userCard-${index}`,
            mass: 2,
          }
        );
        Composite.add(engine.world, body);
        userCardsRef.current[index].body = body;
      }
    });

    smallCards.forEach((card, index) => {
      const cardElement = smallCardsRef.current[index]?.el;
      if (cardElement && cardElement.offsetParent !== null) {
        const width = cardElement.offsetWidth;
        const height = cardElement.offsetHeight;
        const body = Bodies.rectangle(
          Math.random() * window.innerWidth,
          -Math.random() * 400,
          width,
          height,
          {
            restitution: 0.7,
            friction: 0.3,
            label: `smallCard-${index}`,
            mass: 2,
          }
        );
        Composite.add(engine.world, body);
        smallCardsRef.current[index].body = body;
      }
    });

      // 🕒 After 2.5 seconds, add the roof
      const roofTimeout = setTimeout(() => {
        Composite.add(engine.world, roof);
      }, 2500); // adjust 2500ms (2.5 seconds) based on how fast you want it to close


    const mouse = Mouse.create(sceneRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Composite.add(engine.world, mouseConstraint);




    mouseConstraint.mouse.element.removeEventListener("wheel", mouseConstraint.mouse.mousewheel);
    mouseConstraint.mouse.element.removeEventListener("touchmove", mouseConstraint.mouse.touchmove);

    // 🔥 REMOVE these two lines (do not block mousewheel scrolling)
    // mouseConstraint.mouse.element.removeEventListener('mousewheel', mouseConstraint.mouse.mousewheel);
    // mouseConstraint.mouse.element.removeEventListener('DOMMouseScroll', mouseConstraint.mouse.mousewheel);

    Events.on(engine, "afterUpdate", () => {
      [...userCardsRef.current, ...smallCardsRef.current].forEach((cardWrapper) => {
        if (cardWrapper && cardWrapper.body) {
          const { position, angle } = cardWrapper.body;
          const w = cardWrapper.el.offsetWidth;
          const h = cardWrapper.el.offsetHeight;
          cardWrapper.el.style.transform = `translate(${position.x - w / 2}px, ${position.y - h / 2}px) rotate(${angle}rad)`;
        }
      });
    });

    return () => {
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
 clearTimeout(roofTimeout); // clean timeout properly
    };
  }, [isVisible]);

  return (
    <main className="select-none">
      <section id="community-section" className="md:h-screen h-[70vh] relative bg-gray-900 mx-3 rounded-[30px]">
        {/* UI Elements */}
        <div className="flex w-full gap-2 justify-between my-4">
          <div className="bg-transparent w-fit p-3 rounded-full mr-6 2xl:mr-24 h-fit">
            <Image
              width={500}
              height={500}
              src="/images/linesRight.webp"
              className="h-[3.3rem] md:h-[5rem] object-contain absolute left-12 w-fit"
              alt="linesRight"
            />
          </div>
          <Image
            width={500}
            height={500}
            src="/images/arrowRight.webp"
            className="h-[6rem] md:h-[10rem] w-fit object-contain absolute right-0"
            alt="Arrow"
          />
        </div>

        <div className="text-center mb-5 mt-24 xl:mt-24">
          <h1 id="commH1" className="uppercase font-bold md:text-5xl text-[1.35rem] SF-Pro-Bold">where ALI meets community</h1>
          <h2 id="commH2" className="italic font-thin md:text-5xl text-[1.35rem] SF-Pro-Display-Regular">Get Smarter Every Day</h2>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-3 lg:space-y-0 space-y-2 md:space-y-3 items-center justify-center">
          <Image
            src="/store/googlePlay.webp"
            className="h-[2rem] w-[6.5rem] md:h-[2.6rem] md:w-[7.9rem] lg:h-[2.2rem] lg:w-[7rem]"
            width={500}
            height={500}
            alt="Google Play"
          />
          <Image
            width={500}
            height={500}
            src="/store/appStore.webp"
            className="h-[2rem] w-[6.5rem] md:h-[2.6rem] md:w-[7.9rem] lg:h-[2.2rem] lg:w-[7rem]"
            alt="App Store"
          />
        </div>

        <Image
          width={500}
          height={500}
          src="/images/linesRight.webp"
          className="h-[11vh] absolute hidden object-contain md:block right-[11vw] top-[12vh] w-[14vw]"
          alt="linesRight"
        />

        {/* Matter.js Scene */}
        <div ref={sceneRef} className="absolute inset-0 overflow-hidden">
          {smallCards.map((item, index) => (
            <div
              key={index}
              ref={(el) => (smallCardsRef.current[index] = { el })}
              className={`rounded-[30px] flex gap-2 w-fit py-1 px-3 items-center ${item.color} absolute`}
            >
              <Image
                width={500}
                height={500}
                src={item.icon}
                className="h-[1.6rem] object-contain w-fit"
                alt={item.text}
              />
              <h4>{item.text}</h4>
            </div>
          ))}

          {userCards.map((card, index) => (
            <div
              key={index}
              ref={(el) => (userCardsRef.current[index] = { el })}
              className={`w-[300px] SF-Pro-Display-Regular h-[120px] ${card.backGround} rounded-2xl shadow-md p-4 absolute top-0 left-0 flex flex-col justify-center overflow-hidden`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex">
                  <Image
                    src={card.image}
                    alt={card.user}
                    width={42}
                    height={42}
                    className="rounded-full object-contain"
                  />
                  <div className="ml-2">
                    <div className="font-bold text-sm">{card.user}</div>
                    <div className="text-xs">{card.time}</div>
                  </div>
                </div>
                <SlOptions />
              </div>
              <div className="text-sm font-medium">{card.question}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}