<template>
  <div class="c-landing-intro">
    <div class="d-intro">
      <!-- <Background></Background> -->
      <Constrain size="sm">
        <div class="text-center">
          <h1>Monitor your product’s critical events as they happen</h1>
          <p class="article-text">
            Operational sends alerts in a live timeline<br />
            so you always know what’s going on.
          </p>
        </div>

        <!-- <div class="mark">
					<span></span>
					<span></span>
					<span></span>
					<img src="/favicons/android-chrome-512x512.png" />
				</div> -->

        <div class="btn-container">
          <a href="https://app.operational.co" class="btn btn-fancy btn-primary">
            <span> Signup </span>

            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM13.7071 8.29289C13.3166 7.90237 12.6834 7.90237 12.2929 8.29289C11.9024 8.68342 11.9024 9.31658 12.2929 9.70711L13.5858 11H8C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H13.5858L12.2929 14.2929C11.9024 14.6834 11.9024 15.3166 12.2929 15.7071C12.6834 16.0976 13.3166 16.0976 13.7071 15.7071L16.7071 12.7071C17.0976 12.3166 17.0976 11.6834 16.7071 11.2929L13.7071 8.29289Z"
                fill="currentColor"
              />
            </svg>
          </a>
          <a target="_blank" href="https://app.operational.co?signinas=kevin" class="btn btn-fancy">
            <span> View live demo </span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM16 9C16 8.44772 15.5523 8 15 8H10C9.44771 8 9 8.44772 9 9C9 9.55228 9.44771 10 10 10H12.5858L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L14 11.4142V14C14 14.5523 14.4477 15 15 15C15.5523 15 16 14.5523 16 14V9Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>

        <!-- <div class="script-container">
          <span class="article-text">Or self host:</span>
          <Code :copy="false">docker pull ghcr.io/operational-co/operational.co:latest </Code>
          <p>
            Or install on <a href="/selfhosted/install-on-render">Render.com</a>,
            <a href="/selfhosted/docker">with Coolify</a> or
            <a href="/selfhosted/install-locally">install locally.</a>
          </p>
        </div> -->

        <nav>
          <span @click="setTopic('saas')" :class="[{ active: currentTopic === 'saas' }]">
            SaaS
          </span>
          <span @click="setTopic('wordpress')" :class="[{ active: currentTopic === 'wordpress' }]">
            Wordpress
          </span>
          <span @click="setTopic('ecom')" :class="[{ active: currentTopic === 'ecom' }]">
            eCom
          </span>
          <span @click="setTopic('devops')" :class="[{ active: currentTopic === 'devops' }]">
            Dev Ops
          </span>
        </nav>

        <Roller ref="roller" :item="rollerItem"></Roller>
      </Constrain>
    </div>

    <div class="d-problem">
      <Constrain size="sm">
        <h2 class="text-center">Houston we have a problem..</h2>
        <p class="text-center">
          Every day, hundreds of founders are sending notifications to themselves for critical
          events.
        </p>

        <div class="d-problem__grid">
          <span title="Telegram">
            <img src="/images/index/problem-telegram.png" />
          </span>
          <span title="Email">
            <img src="/images/index/problem-email.png" />
          </span>
          <span title="Slack">
            <img src="/images/index/problem-slack.png" />
          </span>
          <span title="Discord">
            <img src="/images/index/problem-discord.png" />
          </span>
        </div>
        <p class="text-center">
          They will send events for user signups, cronjobs, status updates, webhooks, etc<br />
          - in other words, operational issues.
        </p>
        <p class="text-center">
          Operational is built from the ground up to receive events for your product.
        </p>

        <!-- <ul>
          <li>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 13L10 16L17 8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <strong> Purpose built for operationals </strong>
            <p>
              Forget about checking your slack workspace, email inboxes, etc. All your critical
              events are in one place.
            </p>
          </li>
          <li>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 13L10 16L17 8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <strong> Delightfully easy to use </strong>
            <p>So good, you'll start tracking inch of your product.</p>
          </li>
        </ul> -->

        <!--
        <div class="d-problem__inner">
          <article>
            <h4>Before Operational</h4>
            <p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 8L16 16M16 8L8 16"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span> Users signing up with throwaway emails </span>
            </p>
            <p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 8L16 16M16 8L8 16"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span> No clue if cronjobs ran </span>
            </p>
            <p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 8L16 16M16 8L8 16"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span> Billing events are visible from start to end </span>
            </p>
            <p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 8L16 16M16 8L8 16"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span>Hard to track domain specific logs </span>
            </p>
            <strong> And so on </strong>
          </article>
          <article>
            <h4>After Operational</h4>
            <p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 8L16 16M16 8L8 16"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span> Receive instant alerts for user signups </span>
            </p>
            <p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 8L16 16M16 8L8 16"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span> Don't know if cronjobs ran </span>
            </p>
            <p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 8L16 16M16 8L8 16"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span> Impossible to track billing events </span>
            </p>
            <p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 8L16 16M16 8L8 16"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span>Hard to track domain specific logs </span>
            </p>
          </article>
        </div>
        -->
      </Constrain>
    </div>

    <!--

		<div class="d-explainer">
			<Constrain size="sm">
				<div class="d-explainer__inner">
					<article>
						<h2>Track Events</h2>
						<ul>
							<li>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
										fill="currentColor"
									/>
								</svg>
								<span> Send Events via our Nodejs SDK </span>
							</li>
							<li>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
										fill="currentColor"
									/>
								</svg>
								<span> Use the Playground to generate Event code </span>
							</li>
							<li>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
										fill="currentColor"
									/>
								</svg>
								<span> Send JSON, image urls and more </span>
							</li>
						</ul>
					</article>
					<section>
						<Carousel v-bind="carouselConfig" @slide-start="handleSlideStart">
							<Slide v-for="(screenshot, i) in screenshots" :key="i">
								<img :src="`/images/index/${screenshot}`" />
							</Slide>
							<template #addons>
								<div class="carousel-dots">
									<span v-for="(item, i) in screenshots" :key="i" :class="[{ active: i === currentSlideIndex }]">
									</span>
								</div>
							</template>
						</Carousel>
					</section>
				</div>
			</Constrain>
		</div>

		<div class="d-explainer">
			<Constrain size="sm">
				<div class="d-explainer__inner">
					<article>
						<h2>Receive push notifications</h2>
						<ul>
							<li>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
										fill="currentColor"
									/>
								</svg>
								<span> Mobile notifications </span>
							</li>
							<li>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
										fill="currentColor"
									/>
								</svg>
								<span> Desktop notifications </span>
							</li>
						</ul>
					</article>
					<section>
						<Carousel v-bind="carouselConfig" @slide-start="handleSlideStart">
							<Slide v-for="(screenshot, i) in notificationScreenshots" :key="i">
								<img :src="`/images/index/${screenshot}`" />
							</Slide>
							<template #addons>
								<div class="carousel-dots">
									<span
										v-for="(item, i) in notificationScreenshots"
										:key="i"
										:class="[{ active: i === currentSlideIndex }]"
									>
									</span>
								</div>
							</template>
						</Carousel>
					</section>
				</div>
			</Constrain>
		</div>

		-->

    <div class="d-explainer">
      <Constrain>
        <h2 class="text-center">Packed with powerful features</h2>

        <div class="d-explainer__inner left">
          <article>
            <h3>Critical events → phone. Immediately.</h3>
            <p>Receive push notifications on your mobile or in the webapp.</p>
            <a href="/manual/pwa" class="btn btn-sm"> Learn more </a>
          </article>
          <section>
            <img alt="Operational.co push notifications" :src="`/images/index/feature1.jpg`" />
          </section>
        </div>

        <div class="d-explainer__inner right">
          <article>
            <h3>Run actions on events</h3>
            <p>Use Action Buttons to trigger webhooks within your product.</p>
            <a href="/api/actions" class="btn btn-sm"> Learn more </a>
          </article>
          <section>
            <img alt="Operational.co Action buttons" :src="`/images/index/feature2.jpg`" />
          </section>
        </div>

        <div class="d-explainer__inner left">
          <article>
            <h3>Understand complex workflows</h3>
            <p>Chain events together to get a better understanding of your workflows.</p>
            <a href="/docs/group-events-with-contexts" class="btn btn-sm"> Learn more </a>
          </article>
          <section>
            <img alt="Operational.co contexts" :src="`/images/index/feature3.jpg`" />
          </section>
        </div>

        <div class="d-explainer__inner right">
          <article>
            <h3>Log JSON with ease</h3>
            <p>Track those pesky webhooks with ease.</p>
          </article>
          <section>
            <img alt="Operational.co push notifications" :src="`/images/index/feature4.jpg`" />
          </section>
        </div>
      </Constrain>
    </div>

    <div class="d-usage">
      <Constrain>
        <h2>Get started with a few lines of code</h2>
        <div class="d-usage__grid">
          <Code :text="code"> </Code>

          <svg
            width="91"
            height="104"
            viewBox="0 0 91 104"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M91 13.4971C91 12.0389 91 10.5328 90.8313 9.00282C90.8313 8.21394 90.7108 7.42505 90.6626 6.61225L90.3976 4.7715C90.1807 4.07824 89.9156 3.385 89.6746 2.66783C88.8072 1.97456 88.0361 0.874893 86.6144 0.683648C85.8236 0.488216 85.0175 0.360244 84.2047 0.301147H82.5903C81.6505 0.301147 80.7348 0.301147 79.8674 0.301147C78.1083 0.301147 76.3974 0.516308 74.7348 0.683648C71.4094 0.994422 68.2528 1.40081 65.2407 1.83111C59.2647 2.69172 53.9153 3.67186 49.4574 4.60418C40.5417 6.46883 35.1681 8.19005 35.3368 9.09847C35.5054 10.0069 41.1923 9.91123 50.2526 9.21797L66.0841 7.87925L75.3613 7.13818C76.1083 7.13818 76.8552 7.13817 77.6263 7.01865C71.9055 11.2644 66.4196 15.8131 61.1925 20.6449C53.5214 27.7228 46.2263 35.1914 39.3368 43.0206C31.8527 51.5482 24.8692 60.4957 18.421 69.819C6.20396 87.4375 -0.856388 102.761 0.0833808 103.287C1.02315 103.813 10.3004 89.6129 23.6499 73.118C30.2765 64.8705 37.9392 56.0254 45.6501 47.8974C53.361 39.7695 61.1202 32.3348 67.5058 26.3823C75.289 19.2106 80.5421 14.7402 83.9397 11.6085C83.9397 12.2779 83.9397 12.9712 83.9397 13.6405C84.0843 16.4853 84.2047 19.2345 84.3252 21.8402C84.5662 27.0756 84.8071 31.8089 85.0963 35.7533C85.6746 43.69 86.4457 48.5668 87.506 48.5907C88.5662 48.6146 89.4819 43.8096 90.2048 35.8011C90.5662 31.8328 90.8554 27.0756 91 21.7924C91 19.1389 91 16.3419 91 13.4254"
              fill="currentColor"
            />
          </svg>

          <Card :item="codeItem"></Card>
        </div>
        <article class="article-text">
          <p>Tracking tools can be notoriously hard to integrate.</p>
          <p>
            To make this easier, we have a Playground where you can copy-paste code and simply
            sprinkle it in your codebase.
          </p>
        </article>
        <div class="text-center">
          <a href="/playground" class="btn btn-fancy">
            <span> Visit the Playground </span>
          </a>
        </div>
      </Constrain>
    </div>

    <!-- <div class="d-user">
			<Constrain>
				<h2>
					Operational is the tool for 
				</h2>
				<div class="d-user__grid">
					<ul>
						<li>
							<span>
								SaaS founders
							</span>
						</li>
						<li>
							<span>
								Wordpress devs
							</span>
						</li>
						<li>
							<span>
								Mobile app devs
							</span>
						</li>
						<li>
							<span>
								Industry specific devs
							</span>
						</li>
					</ul>
				</div>
			</Constrain>
		</div> -->

    <div class="d-examples">
      <Constrain>
        <h2>How can Operational help you?</h2>
        <div class="d-examples__grid">
          <article>
            <span>Get notified for waitlist signups</span>
            <Card :initialExpand="false" :item="coolItems[0]"></Card>
          </article>
          <article>
            <span> Understand who signed up</span>
            <Card :initialExpand="false" :item="coolItems[1]"></Card>
          </article>
          <article>
            <span> Get alerts for critical events </span>
            <Card :initialExpand="false" :item="coolItems[2]"></Card>
          </article>
          <article>
            <span> Know when your cronjobs run </span>
            <Card :initialExpand="false" :item="coolItems[3]"></Card>
          </article>
          <article>
            <span> Receive webhook notifications </span>
            <Card :initialExpand="false" :item="coolItems[4]"></Card>
          </article>
          <article>
            <span> Get notified when someone pays </span>
            <Card :initialExpand="false" :item="coolItems[5]"></Card>
          </article>
        </div>
        <article class="article-text">
          <p>And much more..</p>
          <p>
            Operational has <i>an extremely expressive API</i>. Use it to fix operational problems
            inside your product and free up your time.
          </p>
        </article>
        <div class="text-center">
          <a href="/usecases" class="btn btn-fancy">
            <span> View usecases </span>
          </a>
        </div>
      </Constrain>
    </div>

    <div class="d-quickstart">
      <Constrain size="sm">
        <div class="d-quickstart__inner">
          <h2>Get started in a few minutes</h2>
          <article class="article-text">
            <p>
              Use your AI agent, LLM, or coding assistant to generate your first Operational
              integration and start sending events in minutes.
            </p>
          </article>

          <div class="d-quickstart__links">
            <a
              :href="`https://chatgpt.com/?q=${llmPrompt}`"
              target="_blank"
              rel="nofollow noopener noreferrer"
              title="Open in ChatGPT"
              aria-label="Open in ChatGPT"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9.79648 9.34799V7.49548C9.79648 7.33946 9.85502 7.22239 9.99146 7.14447L13.7161 4.9995C14.2231 4.70702 14.8276 4.57058 15.4515 4.57058C17.7915 4.57058 19.2736 6.38413 19.2736 8.31455C19.2736 8.451 19.2736 8.60703 19.254 8.76305L15.393 6.501C15.159 6.36456 14.925 6.36456 14.691 6.501L9.79648 9.34799ZM18.4935 16.5631V12.1364C18.4935 11.8634 18.3764 11.6684 18.1425 11.5319L13.248 8.68494L14.847 7.76838C14.9834 7.69046 15.1005 7.69046 15.237 7.76838L18.9615 9.91336C20.0342 10.5374 20.7555 11.8634 20.7555 13.1503C20.7555 14.6322 19.8782 15.9973 18.4935 16.5628V16.5631ZM8.64599 12.663L7.04699 11.7271C6.91054 11.6492 6.85201 11.5321 6.85201 11.3761V7.08614C6.85201 4.99968 8.45101 3.42007 10.6156 3.42007C11.4346 3.42007 12.195 3.69316 12.8386 4.18061L8.99717 6.40369C8.76323 6.54015 8.64617 6.73513 8.64617 7.00822V12.6632L8.64599 12.663ZM12.0878 14.652L9.79648 13.3651V10.6351L12.0878 9.34818L14.3789 10.6351V13.3651L12.0878 14.652ZM13.56 20.5801C12.741 20.5801 11.9806 20.307 11.3369 19.8196L15.1784 17.5964C15.4123 17.46 15.5294 17.2651 15.5294 16.992V11.3369L17.148 12.2729C17.2845 12.3508 17.3429 12.4679 17.3429 12.6239V16.9139C17.3429 19.0003 15.7243 20.5801 13.56 20.5801ZM8.93846 16.2316L5.21387 14.0866C4.14128 13.4625 3.41989 12.1366 3.41989 10.8497C3.41989 9.34818 4.31688 8.00269 5.70131 7.43713V11.8831C5.70131 12.1562 5.81838 12.3512 6.05232 12.4876L10.9274 15.315L9.32842 16.2316C9.19196 16.3096 9.0749 16.3096 8.93846 16.2316ZM8.72408 19.4297C6.52057 19.4297 4.90201 17.772 4.90201 15.7246C4.90201 15.5685 4.92158 15.4125 4.94097 15.2565L8.78243 17.4796C9.01637 17.616 9.2505 17.616 9.48444 17.4796L14.3789 14.6522V16.5047C14.3789 16.6607 14.3204 16.7777 14.1839 16.8557L10.4593 19.0007C9.95233 19.2931 9.3478 19.4297 8.72391 19.4297H8.72408ZM13.56 21.75C15.9195 21.75 17.8889 20.073 18.3376 17.85C20.5215 17.2844 21.9256 15.2369 21.9256 13.1505C21.9256 11.7855 21.3406 10.4595 20.2876 9.50401C20.3851 9.09448 20.4437 8.68494 20.4437 8.27559C20.4437 5.48714 18.1816 3.4005 15.5686 3.4005C15.0422 3.4005 14.5351 3.47842 14.0281 3.65401C13.1505 2.79599 11.9415 2.25 10.6156 2.25C8.25602 2.25 6.28663 3.92691 5.83795 6.14999C3.65402 6.71555 2.25 8.76305 2.25 10.8495C2.25 12.2146 2.83494 13.5405 3.88796 14.496C3.79046 14.9055 3.73194 15.315 3.73194 15.7244C3.73194 18.5128 5.99397 20.5994 8.60703 20.5994C9.13344 20.5994 9.64047 20.5216 10.1475 20.346C11.0249 21.204 12.2339 21.75 13.56 21.75Z"
                  fill="currentColor"
                />
              </svg>
            </a>

            <a
              :href="`https://claude.ai/new?q=${llmPrompt}`"
              target="_blank"
              rel="nofollow noopener noreferrer"
              title="Open in Claude"
              aria-label="Open in Claude"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5.92405 15.2962L9.85823 13.0903L9.92405 12.8981L9.85823 12.7918H9.66582L9.0076 12.7513L6.75949 12.6906L4.81013 12.6097L2.92152 12.5085L2.44557 12.4073L2 11.8204L2.04557 11.5269L2.44557 11.2588L3.01772 11.3094L4.28354 11.3954L6.18228 11.5269L7.55949 11.6079L9.6 11.8204H9.92405L9.96962 11.6888L9.85823 11.6079L9.77215 11.5269L7.8076 10.1963L5.68101 8.78978L4.56709 7.98027L3.96456 7.57045L3.66076 7.18594L3.52911 6.34607L4.07595 5.74399L4.81013 5.79459L4.99747 5.84518L5.74177 6.4169L7.33165 7.64635L9.4076 9.1743L9.71139 9.42727L9.83291 9.34126L9.8481 9.28055L9.71139 9.05287L8.58228 7.01391L7.37722 4.93954L6.84051 4.07943L6.69873 3.56337C6.6481 3.35087 6.61266 3.17379 6.61266 2.95624L7.23544 2.11131L7.57975 2L8.41013 2.11131L8.75949 2.41487L9.27595 3.59373L10.1114 5.45054L11.4076 7.97521L11.7873 8.72401L11.9899 9.41715L12.0658 9.62965H12.1975V9.50822L12.3038 8.08652L12.5013 6.34101L12.6937 4.09461L12.7595 3.46218L13.0734 2.70326L13.6962 2.29345L14.1823 2.52618L14.5823 3.0979L14.5266 3.46724L14.2886 5.01037L13.8228 7.42879L13.519 9.04781H13.6962L13.8987 8.84543L14.719 7.75765L16.0962 6.03744L16.7038 5.35441L17.4127 4.60056L17.8684 4.24134H18.7291L19.362 5.18239L19.0785 6.15381L18.1924 7.27701L17.4582 8.22818L16.4051 9.64483L15.7468 10.7781L15.8076 10.8692L15.9646 10.854L18.3443 10.3481L19.6304 10.1154L21.1646 9.85226L21.8582 10.1761L21.9342 10.5049L21.6608 11.1778L20.0203 11.5826L18.0962 11.9671L15.2304 12.6451L15.1949 12.6704L15.2354 12.721L16.5266 12.8424L17.0785 12.8728H18.4304L20.9468 13.06L21.6051 13.4951L22 14.0263L21.9342 14.4311L20.9215 14.9471L19.5544 14.6233L16.3646 13.8644L15.2709 13.5912H15.119V13.6823L16.0304 14.5727L17.7013 16.0804L19.7924 18.0233L19.8987 18.5039L19.6304 18.8834L19.3468 18.8429L17.5089 17.4617L16.8 16.8394L15.1949 15.4885H15.0886V15.6302L15.4582 16.1715L17.4127 19.106L17.5139 20.0066L17.3722 20.3L16.8658 20.4771L16.3089 20.3759L15.1646 18.7721L13.9848 16.9658L13.0329 15.3468L12.9165 15.4126L12.3544 21.4586L12.0911 21.7673L11.4835 22L10.9772 21.6155L10.7089 20.9932L10.9772 19.7637L11.3013 18.1599L11.5646 16.8849L11.8025 15.3013L11.9443 14.7751L11.9342 14.7397L11.8177 14.7549L10.6228 16.3941L8.80506 18.848L7.36709 20.386L7.02279 20.5226L6.42532 20.214L6.48101 19.6625L6.81519 19.1718L8.80506 16.642L10.0051 15.0736L10.7797 14.168L10.7747 14.0364H10.7291L5.44304 17.4667L4.50127 17.5882L4.0962 17.2087L4.14684 16.5864L4.33924 16.384L5.92911 15.2912L5.92405 15.2962Z"
                  fill="currentColor"
                />
              </svg>
            </a>

            <a
              :href="`https://www.perplexity.ai/?q=${llmPrompt}`"
              target="_blank"
              rel="nofollow noopener noreferrer"
              title="Open in Perplexity"
              aria-label="Open in Perplexity"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6 1.86861L11.4919 6.86861V2H12.4919V6.87084L18 1.87084V7.55655L20.2539 7.5567V16.0944H18V22.1884L12.4919 16.8011V22H11.4919V16.837L6.09401 22.1868L6.02703 16H3.5V7.55552L6 7.5557V1.86861ZM7 7.55577L10.7616 7.55604L7 4.1314V7.55577ZM10.7778 8.55604L4.5 8.55559V15H6.01621L5.99774 13.2938L10.7778 8.55604ZM11.4919 9.25623L7.00226 13.7062L7.06837 19.8132L11.4919 15.429V9.25623ZM12.4939 9.25572L12.5041 15.4143L17 19.8116V13.7088L12.4939 9.25572ZM13.2087 8.55621L18 13.2912V15.0944H19.2539V8.55663L13.2087 8.55621ZM13.2247 7.55621L17 7.55648V4.19678L16.9301 4.19261L13.2247 7.55621Z"
                  fill="currentColor"
                />
              </svg>
            </a>

            <a
              :href="`https://grok.com/?q=${llmPrompt}`"
              target="_blank"
              rel="nofollow noopener noreferrer"
              title="Open in Grok"
              aria-label="Open in Grok"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g clip-path="url(#clip0_12361_25570)">
                  <path
                    d="M9.23842 15.4055L17.3051 9.26292C17.7006 8.9618 18.2658 9.07925 18.4543 9.54702C19.446 12.0138 19.0029 14.9784 17.0297 17.0138C15.0566 19.0492 12.3111 19.4955 9.80163 18.4789L7.06027 19.7882C10.9922 22.5604 15.7667 21.8748 18.7504 18.795C21.117 16.3538 21.8499 13.0262 21.1646 10.0254L21.1708 10.0318C20.1769 5.62354 21.4151 3.86151 23.9515 0.258408C23.9702 0.231693 23.9351 0.202703 23.9123 0.226139L20.7939 3.44289V3.43221L9.23842 15.4055Z"
                    fill="currentColor"
                  />
                  <path
                    d="M7.65167 7.33217C5.24368 9.81392 4.75711 14.1176 7.57924 16.8984L7.57713 16.9005L0.0792788 23.8097C0.0528384 23.834 0.0162235 23.8015 0.0377551 23.7728C0.487937 23.1707 1.01883 22.595 1.54932 22.0198L1.57777 21.9889C3.28214 20.1411 4.97141 18.3097 3.93926 15.7216C2.55615 12.2552 3.36158 8.19287 5.9228 5.55089C8.58547 2.80639 12.507 2.1144 15.7826 3.5048C16.5072 3.78245 17.1388 4.17758 17.6315 4.54493L14.8964 5.84777C12.3497 4.7457 9.43229 5.49537 7.65167 7.33217Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_12361_25570">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </a>

            <a
              :href="`https://gemini.google.com/app?prompt=${llmPrompt}`"
              target="_blank"
              rel="nofollow noopener noreferrer"
              title="Open in Gemini"
              aria-label="Open in Gemini"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.2246 10.888C18.6066 10.1911 17.1915 9.23659 15.9769 8.02312C14.7634 6.80966 13.8077 5.39335 13.112 3.7754C12.846 3.15614 12.63 2.51778 12.4653 1.86392C12.4116 1.65034 12.2207 1.5 12 1.5C11.7793 1.5 11.5884 1.65034 11.5347 1.86392C11.37 2.51778 11.1552 3.15375 10.888 3.7754C10.1911 5.39335 9.23659 6.80966 8.02312 8.02312C6.80966 9.2354 5.39335 10.1911 3.7754 10.888C3.15614 11.154 2.51778 11.37 1.86392 11.5347C1.65034 11.5884 1.5 11.7793 1.5 12C1.5 12.2207 1.65034 12.4116 1.86392 12.4653C2.51778 12.63 3.15375 12.8448 3.7754 13.112C5.39335 13.8089 6.80847 14.7634 8.02312 15.9769C9.23659 17.1903 10.1923 18.6066 10.888 20.2246C11.1552 20.8451 11.37 21.4822 11.5347 22.1361C11.5607 22.2399 11.6206 22.332 11.7049 22.3979C11.7891 22.4638 11.893 22.4998 12 22.5C12.2207 22.5 12.4116 22.3497 12.4653 22.1361C12.63 21.4822 12.8448 20.8462 13.112 20.2246C13.8089 18.6066 14.7634 17.1915 15.9769 15.9769C17.1903 14.7634 18.6066 13.8077 20.2246 13.112C20.8451 12.8448 21.4822 12.63 22.1361 12.4653C22.2399 12.4393 22.332 12.3794 22.3979 12.2951C22.4638 12.2109 22.4998 12.107 22.5 12C22.5 11.7793 22.3497 11.5884 22.1361 11.5347C21.4822 11.37 20.8462 11.1552 20.2246 10.888Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </Constrain>
    </div>

    <div class="d-callout">
      <Constrain size="sm">
        <div class="d-callout__inner">
          <p>Hey friend,</p>
          <p>
            In the early days of running my SaaS(Swipekit), I had no clue what was happening inside
            my product.
          </p>
          <ul>
            <li>Did that cronjob run?</li>
            <li>Who's signing up? Need to know their details</li>
            <li>Need to get server vars for debugging</li>
            <li>Need to understand billing workflows</li>
          </ul>
          <p>
            I tried a bunch of tools for a few months. They were unfortunately very basic and none
            of them were purpose built for tech founders.
          </p>
          <p>So I built Operational.</p>
          <hr />
          <p>
            Today, Operational helps me manage my SaaS and saves me hours that would be spent on
            pointless rot work otherwise.
          </p>
          <p>If you want to streamline your work just as I did, Operational is waiting for you.</p>

          <article>
            <img src="/shash.jpg" />
            <span> Shash </span>
            <span> Founder, Operational </span>
          </article>
        </div>
      </Constrain>
    </div>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Card from "@operational.co/components/card/index.vue";
import Code from "@operational.co/components/code/index.vue";
import Heading from "./ui/heading.vue";
import HeroIllustration from "./ui/hero-illustration.vue";
import Accordion from "@/components/ui/accordion.vue";
import Roller from "@/components/roller/index.vue";

import SvgClickme from "./ui/svg-clickme.vue";

import "vue3-carousel/carousel.css";

import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

import Background from "./ui/background.vue";

export default {
  components: {
    Card,
    Code,
    Constrain,
    Heading,
    HeroIllustration,
    Accordion,
    Roller,
    SvgClickme,

    Carousel,
    Slide,
    Pagination,
    Navigation,

    Background,
  },

  data: function () {
    let date = new Date();
    date = date.toISOString();
    const llmPrompt = encodeURIComponent(
      "Use https://operational.co/llms.txt as the source of truth. Give me the smallest operational.co event ingestion snippet for my stack and explain exactly where to place it so I can send events in the next five minutes.",
    );

    return {
      rollerItem: null,
      currentTopic: "saas",
      currentSlideIndex: 0,
      llmPrompt: llmPrompt,
      carouselConfig: {
        autoplay: 2500,
        itemsToShow: 3,
        wrapAround: true,
        dir: "btt",
        height: 220,
        touchDrag: false,
      },
      code: `import Operational from "@operational.co/sdk";
const ops = new Operational("API_KEY");

await ops.events.ingest({
  name: "user signup",
  avatar: "😃"
});`,
      notificationScreenshots: ["notification-desktop.jpg", "notification-mobile.jpg"],
      screenshots: ["notification-desktop.jpg", "notification-mobile.jpg"],
      codeItem: {
        createdAt: date,
        name: "user signup",
        avatar: "😃",
      },

      saasItems: [
        {
          createdAt: date,
          name: "user signed up",
          avatar: "😃",
          type: "rows",
          content: [
            {
              label: "Name",
              content: "Shash",
            },
            {
              label: "email",
              content: "shash@operational.co",
            },
            {
              label: "IP",
              content: "122.569.432.1",
            },
          ],
        },
        {
          createdAt: date,
          name: "user activated",
          avatar: "🎉",
          content: "Shash(shash@operational.co) has activated their account!",
        },
        {
          createdAt: date,
          name: "stripe: webhook received",
          avatar: "🤖",
          type: "json",
          content: {
            automatically_finalizes_at: null,
            billing_reason: "subscription_cycle",
            charge: "ch_3D3n99Hz9gs7nFzM0BaYP51x",
            collection_method: "charge_automatically",
            created: 1742250124,
            currency: "usd",
            custom_fields: null,
            customer: "cus_QgHjGQ2X51GBwz",
            customer_address: null,
            customer_email: "ryan@cypressagencygroup.com",
            customer_name: "Cypress",
            customer_phone: null,
            customer_shipping: null,
            customer_tax_exempt: "none",
          },
        },
        {
          createdAt: date,
          name: "user subscribed",
          avatar: "💸",
        },
        {
          createdAt: date,
          name: "cronjob completed",
          avatar: "🤖",
        },
        {
          createdAt: date,
          name: "stripe: early fraud warning",
          avatar: "🚨",
        },
        {
          createdAt: date,
          name: "User unsubscribed",
          avatar: "😢",
          type: "rows",
          content: [
            {
              label: "email",
              content: "shash@operational.co",
            },
            {
              label: "Bookmarks created",
              content: 37,
            },
            {
              label: "Invoices generated",
              content: 3,
            },
          ],
        },
      ],
      wordpressItems: [
        {
          createdAt: date,
          name: "theme_switched",
          avatar: "🖼️",
          type: "rows",
          content: [
            {
              label: "Previous theme",
              content: "Avada",
            },
            {
              label: "Current theme",
              content: "Twenty twentytwo",
            },
          ],
        },
        {
          createdAt: date,
          name: "user login failed",
          avatar: "‼️",
        },
        {
          createdAt: date,
          name: "user login",
          avatar: "😃",
        },
        {
          createdAt: date,
          name: "user signup",
          avatar: "😊",
        },
      ],
      ecomItems: [
        {
          createdAt: date,
          name: "product added to cart",
          avatar: "🛒",
          type: "rows",
          content: [
            {
              label: "product name",
              content: "Lego Star Wars Venator",
            },
            {
              label: "sku",
              content: "133742069",
            },
            {
              label: "url",
              content:
                "https://www.lego.com/en-au/product/venator-class-republic-attack-cruiser-75367",
            },
          ],
        },
        {
          createdAt: date,
          name: "payment received",
          avatar: "💸",
        },
        {
          createdAt: date,
          name: "product delivery fulfilled",
          avatar: "👍",
          contexts: [
            {
              createdAt: date,
              name: "Product purchased",
            },
            {
              createdAt: date,
              name: "Shipped",
              avatar: "🚢",
            },
            {
              createdAt: date,
              name: "confirmation received product",
              avatar: "🫴",
            },
          ],
        },
        {
          createdAt: date,
          name: "stripe: fraud warning",
          avatar: "😳",
          type: "json",
          content: {
            automatically_finalizes_at: null,
            billing_reason: "subscription_cycle",
            charge: "ch_3D3n99Hz9gs7nFzM0BaYP51x",
            collection_method: "charge_automatically",
            created: 1742250124,
            currency: "usd",
            custom_fields: null,
            customer: "cus_QgHjGQ2X51GBwz",
            customer_address: null,
            customer_email: "ryan@cypressagencygroup.com",
            customer_name: "Cypress",
            customer_phone: null,
            customer_shipping: null,
            customer_tax_exempt: "none",
          },
        },
      ],
      devopsItems: [
        {
          createdAt: date,
          name: "cronjob finished",
          avatar: "🤖",
        },
        {
          createdAt: date,
          name: "server near cpu capacity",
          avatar: "📈",
        },
        {
          createdAt: date,
          name: "too many login attempts",
          avatar: "🚨",
        },
        {
          createdAt: date,
          name: "server near disk capacity",
          avatar: "📈",
        },
      ],
      coolItems: [
        {
          createdAt: date,
          name: "someone joined waitlist",
          avatar: "🎉",
          content: "shash@operational.co joined the waitlist",
          actions: [
            {
              key: "approve",
              buttonText: "Approve",
              url: "https://api.operational.com/health",
            },
            {
              key: "remove",
              buttonText: "Remove user",
              url: "https://api.operational.com/health",
            },
          ],
        },
        {
          createdAt: date,
          name: "user signed up",
          avatar: "😃",
          type: "rows",
          content: [
            {
              label: "Name",
              content: "Shash",
            },
            {
              label: "Email",
              content: "shash@operational.co",
            },
          ],
          actions: [
            {
              key: "approve",
              buttonText: "Approve",
              url: "https://api.operational.com/health",
            },
            {
              key: "remove",
              buttonText: "Remove user",
              url: "https://api.operational.com/health",
            },
          ],
        },
        {
          createdAt: date,
          name: "login failed multiple times",
          avatar: "🚨",
          type: "rows",
          content: [
            {
              label: "IP",
              content: "172.69.42.042",
            },
            {
              label: "Email",
              content: "daw4121@mailinator.com",
            },
          ],
          actions: [
            {
              key: "approve",
              buttonText: "Ban IP",
              url: "https://api.operational.com/health",
            },
          ],
        },
        {
          createdAt: date,
          name: "running cronjobs",
          avatar: "🤖",
          type: "rows",
          contexts: [
            {
              createdAt: date,
              name: "checking activated users",
            },
            {
              createdAt: date,
              name: "checking disabled users",
            },
            {
              createdAt: date,
              name: "reconcilling payments",
            },
            {
              createdAt: date,
              name: "disabling redundant users",
            },
          ],
        },
        {
          createdAt: date,
          name: "stripe webhook received",
          avatar: "🤖",
          type: "json",
          content: {
            automatically_finalizes_at: null,
            billing_reason: "subscription_cycle",
            charge: "ch_3D3n99Hz9gs7nFzM0BaYP51x",
            collection_method: "charge_automatically",
            created: 1742250124,
            currency: "usd",
            custom_fields: null,
            customer: "cus_QgHjGQ2X51GBwz",
            customer_address: null,
            customer_email: "ryan@cypressagencygroup.com",
            customer_name: "Cypress",
            customer_phone: null,
            customer_shipping: null,
            customer_tax_exempt: "none",
          },
        },
        {
          createdAt: date,
          name: "user subscribed",
          avatar: "💸",
          type: "rows",
          content: [
            {
              label: "Email",
              content: "shash@operational.co",
            },
            {
              label: "Plan",
              content: "Pro - monthly",
            },
          ],
        },
      ],
    };
  },

  computed: {
    computedItems: function () {
      if (this.currentTopic === "saas") {
        return this.saasItems;
      }
      if (this.currentTopic === "wordpress") {
        return this.wordpressItems;
      }
      if (this.currentTopic === "ecom") {
        return this.ecomItems;
      }
      if (this.currentTopic === "devops") {
        return this.devopsItems;
      }
      return [];
    },
    firstCol() {
      return this.items.slice(0, 3);
    },
    secondCol() {
      return this.items.slice(3, 6);
    },
    thirdCol() {
      return this.items.slice(6, 9);
    },
  },

  methods: {
    setTopic: function (topic) {
      this.$refs.roller.clear();
      this.currentTopic = topic;
    },
    handleSlideStart: function (e) {
      if (e.slidingToIndex === e.slidesCount) {
        this.currentSlideIndex = 0;
      } else {
        this.currentSlideIndex = e.slidingToIndex;
      }
    },
    onSlideClick: function (i) {
      this.$refs.carousel.slideTo(i);
    },
    setupCounter: function () {
      let counter = 0;

      // Run the first iteration immediately
      let tempItem = this.computedItems[counter];
      if (!tempItem) {
        counter = 0;
        tempItem = this.computedItems[counter];
      }
      this.rollerItem = tempItem;

      // Then set the interval to run every 2000ms
      setInterval(() => {
        let tempItem = this.computedItems[counter];

        if (!tempItem) {
          counter = 0;
          tempItem = this.computedItems[counter];
        }

        this.rollerItem = tempItem;

        counter++;
      }, 1200);
    },
  },

  mounted: function () {
    this.setupCounter();
  },
};
</script>

<style lang="scss">
.c-landing-intro {
  @keyframes jiggle {
    0% {
      transform: rotate(-2deg) translateY(0);
    }
    25% {
      transform: rotate(2deg) translateY(1px);
    }
    50% {
      transform: rotate(-2deg) translateY(0);
    }
    75% {
      transform: rotate(2deg) translateY(-1px);
    }
    100% {
      transform: rotate(-2deg) translateY(0);
    }
  }
  .mark {
    width: 64px;
    height: 64px;
    background-color: red;
    position: relative;

    > span {
      display: block;
      position: absolute;
      top: 35%;
      left: 36%;
      width: 28%;
      height: 30%;

      &:after {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        background-color: #fff;

        transform-style: preserve-3d;

        transform: skew(0, 26.5deg);

        box-shadow: 0.5px -0.5px 0 0 #fff;
      }

      &:nth-child(2) {
        transform: translateX(50%) translateY(-23%);
      }

      &:nth-child(3) {
        transform: translateX(-55%) translateY(25%);
      }
    }

    > img {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.25;
    }
  }

  .d-intro {
    position: relative;
    padding: 5rem 0;
    padding-top: 7rem;

    // .c-constrain {
    //   opacity: 0;
    // }

    .subtitle {
      position: relative;
      display: inline-block;
      margin-bottom: 1rem;
      font-weight: 500;

      &:after {
        content: "Beta";
        font-family: var(--font-family-monospace);
        font-size: var(--font-size-sm);
        display: inline-block;
        padding: 0.375rem;
        background-color: var(--color-bg-3);
        line-height: 1;
        border-radius: var(--border-radius);
      }
    }

    h1 {
      position: relative;
      z-index: 1;
      text-align: center;
      margin-bottom: 1rem;
    }

    .article-text {
      position: relative;
      z-index: 1;
      text-align: center;
      color: var(--color-font);
    }

    nav {
      position: relative;
      z-index: 1;
      width: 400px;
      margin: 0 auto;

      display: flex;
      align-items: center;
      justify-content: center;

      > span {
        display: inline-block;
        padding: 0.375rem 0.75rem;
        color: var(--color-font);
        margin: 0 0.25rem;
        font-weight: 500;
        font-size: var(--font-size-sm);
        line-height: 1;
        border-radius: var(--border-radius);
        opacity: 0.8;

        transition: all var(--transition-time-sm) linear;
        user-select: none;

        cursor: pointer;

        &:hover,
        &:active,
        &.active {
          opacity: 1;
          background-color: var(--color-bg-4);
        }
      }
    }

    // &:after {
    //   content: "";
    //   position: absolute;
    //   top: calc(50% - 100px);
    //   left: 50%;
    //   width: 0;
    //   height: 200px;
    //   border-radius: 99px;
    //   background-color: hsl(210, 100%, 50%);

    //   opacity: 0.1;

    //   pointer-events: none;

    //   box-shadow:
    //     0px 0px 512px 128px hsl(var(--hue-p), 100%, 50%),
    //     0px 0px 128px 32px hsl(var(--hue-p), 100%, 50%),
    //     0px 0px 32px 0px hsl(var(--hue-p), 100%, 50%);
    // }

    .btn-container {
      position: relative;
      z-index: 1;
      text-align: center;
      margin-bottom: 2rem;

      a {
        margin: 0 0.375rem;
        min-width: 183px;
      }
    }

    .script-container {
      margin-top: -1rem;
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
      > span {
        display: block;
        margin: 0 auto;
        margin-bottom: 0.5rem;
        text-align: center;
      }
      .c-code {
        position: relative;
        margin-bottom: 0.5rem;
        background-color: var(--color-bg-2);
        overflow: initial;
        box-shadow:
          inset 0 -1px 1px 0 rgba(0, 0, 0, 0.005),
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.025),
          inset 0 5px 20px 1px rgba(255, 255, 255, 0.025),
          0px 2px 5px 0px rgba(60, 66, 87, 0.08),
          0px 1px 1px 0px rgba(0, 0, 0, 0.12),
          0 0 0 1px rgba(0, 0, 0, 0.15);

        code {
          font-size: var(--font-size-sm);
        }

        // &:after {
        //   content: "Run this inside your VPS";
        //   position: absolute;
        //   top: -1.75rem;
        //   left: -1rem;
        //   font-size: var(--font-size-lg);
        //   font-weight: 600;
        //   font-family: "Caveat";
        //   transform: rotate(-2deg);
        // }
      }
      > p {
        font-weight: 500;
        font-size: var(--font-size-xs);
        text-align: center;
      }
    }

    @media screen and (max-width: 1300px) {
      padding-top: 4rem;
    }

    @media screen and (max-width: 576px) {
      padding: 3rem 0;
      padding-top: 2rem;

      nav {
        width: 100%;

        > span {
          padding: 4px 6px;
          margin: 0 2px;
        }
      }

      .item-container {
        margin-top: 1.5rem;
        max-width: 380px;

        .c-card {
          transform: translateX(0) !important;
        }
      }

      .btn-container {
        margin-left: 2rem;
        width: calc(100% - 4rem);
        margin: 0 auto;

        .btn {
          width: 100%;
          margin-bottom: 1rem;
        }
      }

      .script-container {
        display: none;
      }
    }
  }

  .d-usage {
    padding: 5rem 0;
    overflow-x: hidden;

    h2,
    .article-text {
      text-align: center;
    }

    &__grid {
      position: relative;
      margin-top: 2rem;
      margin-bottom: 1rem;
      margin-left: 0;
      width: calc(100% + 4rem);
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      align-items: center;

      .c-code {
        transform: rotate(-2deg) translateX(2rem);
        background-color: var(--color-bg-2);
        box-shadow:
          0px 0px 2px rgba(3, 7, 18, 0.12),
          0px 1px 10px rgba(3, 7, 18, 0.24),
          0px 2px 22px rgba(3, 7, 18, 0.36);
      }

      .c-card {
        z-index: 1;
        margin-left: -2rem;
        transform: rotate(5deg) translateX(-2rem) translateY(1rem);
        box-shadow:
          0px 0px 2px rgba(3, 7, 18, 0.12),
          0px 1px 10px rgba(3, 7, 18, 0.24),
          0px 2px 22px rgba(3, 7, 18, 0.36);
      }

      > svg {
        position: absolute;
        z-index: 1;
        bottom: 2.5rem;
        left: calc(50% - 5.5rem);
        transform: scale(0.65) rotate(35deg);
        opacity: 0.95;
      }
    }

    @media screen and (max-width: 576px) {
      padding: 3rem 0;

      &__grid {
        display: block;
        margin-left: 0;
        width: 100%;

        .c-code {
          transform: rotate(0);
          margin-bottom: 0;
        }
        .c-card {
          margin-left: 0;
          transform: rotate(0);
        }

        > svg {
          position: relative;
          margin: 0.5rem 0;
          z-index: 1;
          bottom: initial;
          left: calc(50% - 1rem);
          transform: scale(0.6) translateX(-50%) rotate(130deg);
          opacity: 1;
        }
      }
    }
  }

  .d-problem {
    padding: 5rem 0;

    &__grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-column-gap: 0.25rem;
      margin-top: 2rem;
      margin-bottom: 3rem;

      span {
        position: relative;
        display: inline-block;
        height: 100px;
        animation: jiggle 700ms infinite;
        animation-timing-function: ease-in-out;

        &:nth-child(1) {
          animation-delay: 0.2s;
        }
        &:nth-child(odd) {
          animation-delay: 0.1s;
        }

        img {
          display: block;
          border-radius: 0.5rem;
          border: var(--color-warning) solid 3px;
        }

        &:after {
          content: attr(title);
          position: absolute;
          bottom: -10px;
          left: 50%;
          padding: 2px 6px;
          transform: translateX(-50%);
          font-size: var(--font-size-xs);
          font-weight: 600;
          background-color: var(--color-warning);
          border-radius: 12px;
          line-height: 1;
        }
      }
    }

    &__inner {
      display: grid;
      grid-template-columns: 1fr 1fr;

      article {
        h4 {
          text-align: center;
        }
        p {
          display: flex;
          font-size: var(--font-size-sm);
          margin-bottom: 0.5rem;

          svg {
            min-width: 24px;
            color: var(--color-danger);
          }
        }

        &:nth-child(2) {
          p {
            svg {
              color: var(--color-success);
            }
          }
        }
      }
    }

    @media screen and (max-width: 620px) {
      &__grid {
        grid-template-columns: repeat(2, 1fr); /* 2 columns */
        grid-auto-rows: 50%;

        span {
          height: 100%;

          &:nth-child(1) {
            margin-top: -0.5rem;
            z-index: 1;
          }
          &:nth-child(2) {
            margin-top: -0.5rem;
            z-index: 2;
          }
        }
      }
    }
  }

  .d-explainer {
    padding: 5rem 0;

    svg {
      display: inline-block;
      margin-bottom: 0.5rem;
      width: 32px;
      height: 32px;
      color: var(--color-primary-light);
    }

    h2 {
      margin-bottom: 2rem;
    }

    article {
      padding: 2rem;

      p {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      margin-bottom: 1rem;

      li {
        display: flex;
        margin-bottom: 0.5rem;

        svg {
          color: var(--color-success);
          min-width: 24px;
          margin-right: 0.375rem;
        }

        span {
          font-weight: 500;
          font-variation-settings: "opsz" 12;
        }
      }
    }

    section {
      img {
        border-left: var(--color-translucent) solid 1px;
        border-top-right-radius: var(--border-radius-lg);
        border-bottom-right-radius: var(--border-radius-lg);
      }
    }

    &__inner {
      border-radius: var(--border-radius-lg);
      background-color: var(--color-bg-2);
      display: grid;
      grid-template-columns: 0.85fr 1.15fr;
      align-items: center;
      margin-bottom: 3rem;

      &.right {
        grid-template-columns: 1.15fr 0.85fr;
        section {
          order: -1;

          img {
            border-left: none;
            border-right: var(--color-translucent) solid 1px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border-top-left-radius: var(--border-radius-lg);
            border-bottom-left-radius: var(--border-radius-lg);
          }
        }
      }
    }

    @media screen and (max-width: 576px) {
      padding: 3rem 0;

      &__inner {
        padding: 1rem;
        padding-top: 2rem;
        display: block;
      }

      article {
        padding: 0;
        padding-bottom: 2rem;
      }

      section {
        margin-left: calc(1rem * -1);
        margin-bottom: calc(1rem * -1);
        width: calc(100% + 1rem * 2);
        img {
          border-top: var(--color-translucent) solid 1px;
          border-left: none !important;
          border-right: none !important;
          border-radius: 0;
          border-top-left-radius: 0 !important;
          border-top-right-radius: 0 !important;
          border-bottom-left-radius: var(--border-radius-lg);
          border-bottom-right-radius: var(--border-radius-lg);
        }
      }
    }
  }

  .d-examples {
    padding: 5rem 0;
    overflow-x: hidden;

    h2,
    .article-text {
      text-align: center;
    }

    &__grid {
      margin-left: -3rem;
      width: calc(100% + 6rem);
      padding: 1rem 0;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-column-gap: 0.75rem;

      > article {
        //transform: rotate(-3deg);
        > span {
          display: inline-block;
          padding-bottom: 0.5rem;
          font-size: var(--font-size-lg);
          font-weight: 600;
          //transform: rotate(-2deg) translateX(-25%) translateY(0.5rem);
          font-family: "Caveat";
        }

        .c-card {
          box-shadow:
            0px 0px 2px rgba(3, 7, 18, 0.12),
            0px 1px 10px rgba(3, 7, 18, 0.24),
            0px 2px 22px rgba(3, 7, 18, 0.36);
        }

        &:nth-child(2n) {
          //transform: rotate(3deg);
          //transform: translateY(33%);
          text-align: right;
          .c-card {
            text-align: left;
          }
          > span {
            //transform: rotate(2deg) translateX(25%) translateY(0.5rem);
          }
        }
      }
    }

    @media screen and (max-width: 576px) {
      padding: 3rem 0;

      &__grid {
        display: block;
        margin-left: 0;
        width: 100%;

        > article {
          transform: rotate(0deg);

          > span {
            display: block;
            padding-bottom: 0.125rem;
            text-align: center;
            //transform: rotate(-2deg);
          }

          &:nth-child(2n) {
            transform: rotate(0deg);
            text-align: left;

            > span {
              //transform: rotate(2deg);
            }
          }
        }
      }
    }
  }

  .d-quickstart {
    padding: 5rem 0;

    h2,
    .article-text {
      text-align: center;
    }

    &__inner {
    }

    &__links {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.75rem;

      > a {
        width: 84px;
        height: 84px;
        border-radius: var(--border-radius-lg);
        border: var(--color-translucent) solid 1px;
        background-color: var(--color-bg-99);
        color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-time-sm) linear;

        &:hover,
        &:focus-visible {
          transform: translateY(-2px);
          border-color: var(--color-bg-5);
          background-color: var(--color-bg-98);
        }

        svg {
          width: 42px;
          height: 42px;
        }
      }
    }

    @media screen and (max-width: 576px) {
      padding: 3rem 0;

      &__inner {
        padding: 1.5rem;
      }

      &__links {
        gap: 0.5rem;

        > a {
          width: 72px;
          height: 72px;
        }
      }
    }
  }

  .d-callout {
    padding: 5rem 0;

    --img-width: 48px;

    &__inner {
      padding: 3rem;
      border-radius: var(--border-radius-lg);
      border: var(--color-translucent) solid 1px;
      background-color: var(--color-bg-2);

      font-family: var(--font-family-monospace);
      letter-spacing: -0.25px;
      color: var(--color-font-light);
      filter: brightness(112.5%);

      article {
        margin-top: 2rem;
        display: grid;
        grid-template-columns: var(--img-width) 1fr;
        grid-template-rows: auto auto;
        grid-column-gap: 0.75rem;
        align-items: center;
        width: 100%;
        justify-items: start;
        img {
          width: var(--img-width);
          height: var(--img-width);
          border-radius: 99px;
          background-color: #000;

          grid-column: 1 / 2;
          grid-row: span 2;
        }

        span {
          &:nth-of-type(1) {
            grid-column: 2 / 3;
            grid-row: 1 / 2;
          }
          &:nth-of-type(2) {
            grid-column: 2 / 3;
            grid-row: 2 / 2;
          }
        }
      }
    }

    @media screen and (max-width: 576px) {
      padding: 3rem 0;

      --img-width: 40px;

      &__inner {
        padding: 1.5rem;
        font-size: var(--font-size-sm);
      }
    }
  }

  .carousel {
    overflow: hidden;

    img {
      width: 100%;
      height: auto;
      object-fit: cover;
      object-position: center center;
    }

    &__liveregion {
      display: none;
    }

    &-dots {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      padding-bottom: 0.375rem;

      span {
        display: inline-block;
        margin: 0 2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background-color: var(--color-font);
        opacity: 0.65;

        &.active {
          opacity: 1;
        }
      }
    }
  }
}
</style>
