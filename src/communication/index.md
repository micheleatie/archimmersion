---
layout: layouts/base.njk
title: Communication
bodyClass: communication-page
sectionKey: communication
order: 3
heroImage: ./img/cover.svg
homeBlurb: Immersive Architectural Communication for professional websites and magazines. Beyond vision. We capture architecture as it is experienced. Through advanced imaging technologies and an expert eye for atmosphere, we translate spaces into immersive experiences — faithful, sensory, and atmospheric. Using cutting-edge tools — from 360° immersive environments to high-fidelity 2D photography — we present your project as a true sensory experience, seamlessly integrated into your website or delivered directly to your clients.
permalink: /communication/
links:
  - label: What we Offer
    url: /communication/#what-we-offer
  - label: Ideal For
    url: /communication/#ideal-for
---
<anchor id="what-we-offer"></anchor>

We frame architecture as an experience: spatially precise, emotionally clear, and understandable for clients before construction decisions are locked.

- Immersive 360 capture for client dialogue
- Atmosphere-driven visual narratives
- High-fidelity still imagery for editorial and project communication
- Delivery-ready assets for web and presentation workflows

<anchor id="ideal-for"></anchor>

- Architecture and interior design studios
- Client-facing renovation and transformation projects
- Hospitality, culture, and residential storytelling

<div class="comm-experience" data-comm-experience>
  <h2>Street to immersion</h2>
  <figure class="comm-map">
    <div class="comm-map-frame">
      <img src="{{ './img/street-map-wireframe.svg' | resolvePageAsset(page.url) | toBaseRelative }}" alt="Wireframe top-view street map" />
      <a class="comm-map-spot comm-map-spot--street" href="{{ '/communication/#comm-panorama-stack' | toBaseRelative }}" data-map-spot data-target="comm-panorama-stack" aria-label="Open 360 view from this street spot" aria-controls="comm-panorama-stack" aria-pressed="false"></a>
    </div>
    <figcaption>Map pin: open exterior 360 street view.</figcaption>
  </figure>
  <div class="comm-panorama-area">
    <div class="comm-panorama-stack" id="comm-panorama-stack" data-panorama-stack>
      <figure class="comm-panorama">
        <figcaption>360 street panorama (scroll/drag horizontally, then click the building pin)</figcaption>
        <div class="comm-panorama-scroll" data-panorama-scroll>
          <div class="comm-panorama-track">
            <img src="{{ './img/panorama-360-example.svg' | resolvePageAsset(page.url) | toBaseRelative }}" alt="Example 360 panoramic street view" />
            <a class="comm-panorama-pin" href="{{ '/communication/#comm-interior-stack' | toBaseRelative }}" data-interior-pin aria-label="Open interior 360 from this building" aria-controls="comm-interior-stack" aria-pressed="false"></a>
          </div>
        </div>
      </figure>
    </div>
    <div class="comm-panorama-stack comm-panorama-stack--interior" id="comm-interior-stack" data-panorama-stack>
      <figure class="comm-panorama">
        <figcaption>360 interior panorama</figcaption>
        <div class="comm-panorama-scroll" data-panorama-scroll>
          <img src="{{ './img/panorama-360-interior-example.svg' | resolvePageAsset(page.url) | toBaseRelative }}" alt="Example 360 interior panoramic view" />
        </div>
      </figure>
      <aside class="comm-interior-text">
        <h3>Interior reading</h3>
        <p>This viewpoint captures a transition space where light, circulation, and ceiling rhythm define the atmosphere. It is useful for discussing material continuity and how users perceive depth across connected rooms.</p>
        <p>The 360 interior sequence helps clients evaluate scale, openings, and ambient quality before final detailing.</p>
      </aside>
    </div>
  </div>
</div>
