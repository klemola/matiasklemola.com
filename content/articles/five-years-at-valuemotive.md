---
Title: Five years at Valuemotive
Date: 2019-06-25 00:00
Status: published
Category: Articles
Tags: career, personal, valuemotive
Slug: five-years-at-valuemotive
Summary: Looking back at my career progression from a junior front-end developer into a software architect and HR rep at Valuemotive.
Audience: Folks who are interested in working in a consultancy, developers with junior level of experience, and (future) Valuemotive employees.
Publication: Valuemotive blog
Origin: https://blog.valuemotive.com/five-years-at-valuemotive-152b25663711
---

## 2014: Prelude

I graduated from Haaga-Helia university with a bachelor's degree in IT in late 2012. I was already working at a small startup by then. My work there was a good introduction to the field of IT, in both good and bad. I learned a lot.

By 2014 I was unsatisfied about overwork, bad management and lack of new things to learn. Some of my closest friends had recently started to work as consultants. They praised the variety in their work, their salaries and the independent approach to work. It sounded lucrative. I parted ways with the startup and started to look for greener pastures.

<div class="article-content__image">
  <img src="{static}/images/vm_prelude.jpg" alt="Time for new adventures">
</div>

Some weeks later my phone rang. On the other side was a recruiter, who got me in contact with Valuemotive. We set up an interview with the CEO Pekka Lehti and an experienced developer Kristo Kurtén. We met over coffee in a downtown Helsinki coffeehouse, since at the time Valuemotive didn't have a permanent office. I was initially nervous (who wouldn't be at that point in their career). The setting and the tone of the conversation made me relax - I wasn't in an interrogation.

Things went well. Valuemotive started scouting for a project that would be ideal for my experience. After couple of weeks I met with a client and signed a contract with Valuemotive.

<div class="article-content__image">
  <img src="{static}/images/vm_hire.jpg" alt="Hired!">
</div>

## 2014 - early 2016: First project as a junior front-end dev

Valuemotive has a vast network of partner consultancies. Some team is often missing the last developer to round it up. One of our partners can't quite get that position filled with the normal flow of employees. In that case they often turned to us. My first project was a such partnership. A 5-year project to modernize and centralize the national boat registry. No biggie!

<div class="article-content__image">
  <img src="{static}/images/vm_boat_registry.jpg" alt="Sailing the seas of a boat registry">
</div>

Well, my first days in the project were actually pretty smooth. The team size was adequate and the level of expertise at hand was stunning (especially to a junior dev). Normalizing vast amounts of data from different sources and figuring out a proper data model for the registry was the biggest undertaking in the project as a whole. The challenging task was not my responsibility, though.

Public sector employees need to update the registry and access the data in various scenarios. Citizens are required to update information about e.g. their boat when it's sold. In practice end-users access the registry via separate user interfaces for different roles and tasks. I was into [AngularJS](https://angularjs.org/) at the time, having tried [Backbone](https://backbonejs.org/) and [Dojo](https://dojotoolkit.org/) _(yuck)_. The team had already built the base UI in Angular by the time I joined the project, and wanted me to develop it further with a senior front-end dev.

After I got a hold of the general features and design of the UIs, I started to work on new features with the backend-oriented devs. We asked a lot of questions from the end-users to guarantee good UX. I slowly transitioned into a full-stack role, and brushed up on Java by learning from my teammates.

We had a chance to use [React](https://reactjs.org/) for a small sub-project. I was keen to try something new, and gladly took part in it. That side-project was successful and mind-opening. At one and a half years into the larger project, I asked for a new posting.

---

_I often think back to this project, and I have fond memories of great colleagues and the good work that we did. Working in a public sector project is pretty mellow compared to private sector projects._

## Most of 2016: First full-stack project from scratch

I had many options for the next project, six if I recall correctly. All of them would have me focus on front-end. I picked the most interesting one, and went to discuss specifics with the client. Life is a bit random at times - I ended up in a totally different project for the same client. It was a stroke of luck, since it introduced me to an enthusiastic colleague. I would work with him on the project as a duo, and how cool is this, we'd write the front-end in [Elm](https://elm-lang.org/)!

We built a social dating site. Our suggestion to try [Elixir](https://elixir-lang.org/) + [Phoenix](https://phoenixframework.org/) was rejected, even though the real-time focus of the dating site would have been a great fit (plus Elm works great with Phoenix). We then chose a neutral stack for the back-end - [NodeJS](https://nodejs.org/en/), _Express_, _KnexJS_ and some WebSocket lib that I can't quite recall.

<div class="article-content__image">
  <img src="{static}/images/vm_dating_app.jpg" alt="In love with Elm">
</div>

Starting from scratch in a full-stack project was a great learning experience. Using Elm in a commercial project was not common at the time - even globally. Me and my teammate came up with creative ways to deliver features. Back-end work was a big part of my role too. I spent a considerable chunk of the project on integrating external payment services into the application. I needed to use SOAP and write scheduled routines for monthly payments and the like.

Working with Elm was a pleasure. I was only mildly familiar with strong static typing at the time, and the benefits were obvious. We made big changes in UI architecture during the project without having to fear for breaking things. See my colleague's [article](https://ohanhi.com/why-and-when-of-choosing-elm.html) for a summary of the things that Elm can help you with.

I spent a total of 9 months in the project before our contract with the end-client expired. The end product was smooth, stable and easy to use. The dating site launched while the project was on, and operated for roughly two years. It was pretty cool to see and ad for a service you had helped to create in the commercial break of an ice hockey game.

---

_Using an almost pure functional stack blew my mind and still affects me to this day. I learned some of my key programming habits from the project. It was also the start of a fruitful collaboration with the colleague._

## 2017: First Valuemotive team project

The dating site project was followed by a six month stint at a major financial institution, where we extended an electric car rental service. I won't go into much detail about that - it was a run-of-the-mill [Rails](https://rubyonrails.org/) based web app with CMS capabilities. I learned some neat things, and that Ruby/Rails is not my thing. Moving on!

I had a couple of months to spare in the summer of 2017. While I was busy with project work, Valuemotive had secured some major customers and been growing. We had our first service designer and more emphasis on teams. A permanent office, too. Valuemotive had secured a professional tool development gig, which worked well for me.

The service design phase was almost complete when I joined the project. Our goal was to make it easy to manage physical ads on e.g. ski centers. The end-user would create ad campaigns for specific locations. Our team of four created a [CRUD](https://www.codecademy.com/articles/what-is-crud) application with familiar tech, Java and React. The React ecosystem had matured. We used [Redux](https://redux.js.org/) and several third party React components. We created a "cloud infrastructure" for the application - some [Heroku](https://www.heroku.com/) dynos and a database. Some client organizations need a full fledged cloud environment with VPCs, private networks and other security measures. Sometimes a simple Heroku instance will do the job well enough.

<div class="article-content__image">
  <img src="{static}/images/vm_ad_tool.jpg" alt="Buy stuff">
</div>

I had fun working with familiar folk, and as a super nice thing we were able to work from Valuemotive office. After careful planning, productive pair programming and lots of ice-cream we had a nice application ready for deployment. The completion of the project was followed up by another project hunt. After yet another last-minute change I found myself working with the Elm-guru from before.

---

_Working with my Valuemotive colleagues resulted in a lasting relationship with my teammates. By spending my days at the office I could also learn what was happening in Valuemotive on a day-to-day basis. We had people popping by, so I got closer to colleagues that were not in my team as well._

## Late 2017-2019: Hardware

The national railway company was looking to replace their ticket vending machines, which were becoming outdated. The hardware for the new <abbr title="Ticket Vending Machine">TVM</abbr>s was already selected. Our team worked on the sales software and a layer between software and the hardware devices (such as the receipt printer).

This project was spearheaded by an extensive service design phase, too. Our team was able to base all user experience decisions on hard sales data and loads of interviews. We didn't stop the research there - service design was present throughout the project, and we received extra advice from accessibility experts.

<div class="article-content__image">
  <img src="{static}/images/vm_tvm.jpg" alt="A friendly TVM">
</div>

Working with specific hardware was unusual in the face of web development. Knowing exactly what kind of screen, input and general environment a user would have made it possible to hard code things that normally require complex logic. On the other hand we were at the mercy of the operating system, hardware quirks and some unideal aspects of the touch screen.

The 27" screen with portrait orientation allowed us to include a neat accessibility feature. Users can move the whole UI up and down to accommodate their height, or for the UI to be in reach for e.g. a wheelchair bound person. Having a safety glass between the screen and a user was mandatory. We spent ages calibrating the screen to be as good as the tech can do.

We were provided with an HTTP layer over the low-level hardware interfaces. We still had to learn how the hardware operates. An <abbr title="Electric Fund Transfer">EFT</abbr> device has a transaction based logic that had not been abstracted away. Printing a receipt involves several steps. A proximity sensor is not reliable, and so on.

We used web-based tech to power the UI. Most of the work went into iterating on the payment flow and making sure that we know what can go wrong. Considering that TVMs are often in a remote location, they just can't crash and shut down. We wrote extra apps that tracked TVM status and handled software updates. [Firebase](https://firebase.google.com/) turned out to be pretty useful.

In the end we came up with a simple and straightforward way to buy train tickets. One can buy a ticket for a single adult for the next departure in less than 15 seconds.

---

_It wasn't easy to work with the limitations of the platform and the environment, but we succeeded anyway At this point in my career was settling into familiar patterns of building UIs and servers. I mostly added depth to existing technical skills. I learned a lot about working with other teams and about effective service design._

## 2019: Cloud architecture and containers

I had seen client organizations adopt major cloud providers and their services at scale. By late 2018 it was obvious that large organizations need their private clouds and that they often need outside help with setting them up. Valuemotive provides this service. Besides helping organizations move into the cloud, we have introduced them to advanced systems such as [Kafka](https://kafka.apache.org/) and [Kubernetes](https://kubernetes.io/) (where applicable).

Major cloud providers have tons of services and their relationships are not always obvious. Even getting subnets and DNS right can be a daunting task. That's why services like Heroku exist in the first place.

One can set up a service by clicking around the web interface of a cloud provider, or use the CLI. At some point an organization will want to define these things in detail and clicking around is not a reliable way of doing it. I'd been introduced to [Terraform](https://www.terraform.io/) in one of Valuemotive's internal case studies. It allows casual devs and cloud architects alike to define cloud infrastructure using a declarative language.

I put Terraform and my knowledge of individual AWS services into good use in early 2019. A startup was looking into building themselves a serious private cloud from the get go (instead of moving to it when faced with the limitations of simple services). They were familiar with the synergy of using AWS services together, so I designed a [VPC](https://aws.amazon.com/vpc/) for their specific needs. The design was centered on a cluster of [Docker containers](https://www.docker.com/).

<div class="article-content__image">
  <img src="{static}/images/vm_cloud.jpg" alt="Cloud containers (ouch)">
</div>

Having such a design-centric project was a blast, and was finished without a hitch. After drawing several iterations of networking diagrams, I also felt confident in the longevity of the setup.

The project had barely been wrapped up when I joined another project. It had been a while, but I was writing a tool for professionals again. It's great to be able to talk to the future end-users face to face.

We started the project with a service design phase, again. I was in a front-end developer position and writing React components... again. Our team also deployed the app using Docker in a Kubernetes cluster. Having a familiar process and pieces of tech made the development a breeze. We finished below budget and on time, despite a tight schedule.

---

_High-level design work and working with Kubernetes clusters are good examples of how my position as a developer has evolved. I still love to get my hands dirty with actual application development, though. Using familiar tech is a boon for productivity. At this point I had strong preferences for the ways of getting stuff done, and the ability to communicate them to others. I remain open to new ideas though, which I keep receiving from my teammates. I'm glad of the variety of projects Valuemotive can provide._

## Now: internal work

A colleague approached me in late 2018 about a new role in the company. Valuemotive had surpassed the 20 employees threshold a while ago, and we'd recruit with full force in 2019. The goal was to delegate recruitment related tasks to someone so that our CEO has more time for other responsibilities. I had been conducting many recruitment interviews over the years and shown interest in developing the company itself. Though I wasn't present at the initial discussion, I was proposed as the best fit for the role. I tentatively agreed.

I'm intimately familiar with our culture, what we do and what it takes to do the job well. That is why I had the confidence to take up the job - even though I don't have the formal qualification work in HR. We are in contact with several third party recruiters who have helped us tremendously over the years. Communicating with the recruiters and keeping track of ongoing processes takes a good chunk of time. I screen the candidates and hold at least the first interview. The decision to hire is still a group effort.

I had some ideas of my own for the role as well. Having more and more employees and clients can make it tough to keep track of individual career progression and, most importantly, well-being. Being a stress-prone overachiever myself, I knew that it's difficult to take these things up with someone. So even before I started full-time in the new role, I piloted several well-being services in Valuemotive. We had several people try them out and (optionally) share their experiences. I firmly believe that it's possible to prevent exhaustion and other severe conditions by promoting well-being at work. We also have a great tradition in the form of an informal weekly meeting where Valuemotive employees share an honest summary of their work week, and weekend plans. Such sharing often gives cues about hardship and I can then try to work out the issues with a colleague in private.

<div class="article-content__image">
  <img src="{static}/images/vm_kalasatama.jpg" alt="Second home (new Valuemotive office)">
</div>

The transition to the new role took place in mid March 2019. I was a bit lost for the first few days. HR-related work is memory intensive, so having a Trello board to keep track of active processes was super helpful (taking individual's privacy into account, of course). There was a massive backlog of leads from recruiters. Though I knew that I'd be on the phone a lot, I was still surprised by how much time I spent in a phone booth. I had all the time in the world to spend on recruitment, so I was able to organize several interviews per week and communicate about the next steps. It didn't take very long for me to get comfortable with the new tasks, and by June I wasn't surprised that often!

I'll never tire of programming itself. During the transition period I spent a lot of my spare time on personal projects, and will also maintain my skills by mentoring junior developers. I'm also planning to take part in software projects part-time when it's possible.

## The career progression as a whole

I've been a:

0. Junior front-end developer
1. Senior front-end developer
1. (Senior) full-stack developer
1. Software architect (with one foot in cloud architect's boots)
1. "People and competence care person"\*

\*_I made this title up, since "Recruiter", "HR manager" and the like don't reflect my work very well._

Progression of titles doesn't imply superiority at Valuemotive. They reflect individual's expertise and responsibilities instead. Having a certain level of expertise will affect a consultant's hourly pricing, though. We have a transparent model for honoring that in one's salary.

My salary was adjusted several times. I started with a fair amount (way more than I made at the startup). Either I or the CEO Pekka brought it up for review between projects. I am now earning 46% more than five years ago. I am now at roughly 80% of what an experienced developer can earn at Valuemotive.

## Summing it up

I certainly didn't expect most of the things that happened to me over the five years. I've been involved in at least seven projects so far. I've never seen the same exact field of business twice, and I've met hundreds of people. Some of my former teammates are now my friends! At the same time Valuemotive has been growing and maturing as a company. We have new kinds of specializations, a new office and lots of great new people. We have more variety in both clients and projects.

The trade has been evolving too. Gone are the days of manually set up servers hosting a static website with sprinkles of jQuery. Though a static site is still sometimes the right choice, it's probably written with an advanced generator and hosted in e.g. AWS S3. More often than not, users face a single page app or a mobile app. Those apps might be powered by machine learning and the decisions behind then may be guided by service design and data analytics. Being a developer in this climate involves dealing with CI/CD pipelines, containers, configuration as code, component libraries and so on. Most problems are easier to solve, some concepts are so abstract that people stick to what they already know.

**Thanks to Valuemotive and all the people I've been learning from. For the next five years!** 🍻

---

➡ If you found my story interesting, you should definitely visit [our website](https://www.valuemotive.com/). We are on [Twitter](https://twitter.com/Valuemotive), [LinkedIn](https://mk.linkedin.com/company/valuemotive) and [Facebook](https://www.facebook.com/valuemotive), too.
