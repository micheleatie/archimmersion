---
layout: layouts/base.njk
title: Representation
bodyClass: representation-page
sectionKey: representation
order: 2
heroImage: ./img/cover.svg
homeBlurb: We intervene on-site to capture your building with precision and sensitivity. Using advanced 3D scanning technologies, we provide a faithful, immersive, and atmosphere-driven digital restitution — ideal for renovation, design development, and communication.
permalink: /representation/
links:
  - label: What we Offer
    url: /representation/#what-we-offer
  - label: Our Services
    url: /representation/#our-services
  - label: Ideal For
    url: /representation/#ideal-for
---
<!-- the #what-we-offer section begins here  -->
<anchor id="what-we-offer"></anchor>

**High-Fidelity 3D Capture with Sensory Awareness**

We combine advanced 3D scanning tools with a sensitive understanding of architectural atmosphere. Our on-site intervention allows us to produce a precise and immersive digital twin of your existing building.

**Our Methodology**

	•	High-precision 3D scanning

	•	Accurate spatial geometry capture

	•	Faithful light and volumetric understanding

	•	Sensory-informed interpretation of ambiance

**But we go further than pure geometry**

<!-- the #our-services section begins here  -->
<anchor id="our-services"></anchor>

**What You Receive**

	•	Detailed 3D models for renovation or redesign (we go on site and do all the measurements with our advanced professional tools)

	•	Immersive environments for VR integration

	•	Accurate documentation for architectural planning

	•	Atmosphere-sensitive information (luminous and thermal atmospheres, context, material presence, spatial perception (materiality, volumes, proportions, etc.), emotional tone of the existing space)

	•	360° captured photographs of the existing building

<!-- the #ideal-for section begins here  -->
<anchor id="ideal-for"></anchor>

	•	Renovation projects

	•	Heritage documentation

	•	Real estate transformation

	•	Architects/Interior Designers needing high-precision base models for renovation and construction

<div class="comm-experience" data-repr-experience>
  <h2>Street to annotated model</h2>
  <figure class="comm-map">
    <div class="comm-map-frame">
      <img src="{{ './img/street-map-wireframe.svg' | resolvePageAsset(page.url) | toBaseRelative }}" alt="Wireframe top-view street map" />
      <a class="comm-map-spot comm-map-spot--street" href="{{ '/representation/#rep-model-stack' | toBaseRelative }}" data-map-spot data-target="rep-model-stack" aria-label="Open annotated 3D model from this street spot" aria-controls="rep-model-stack" aria-pressed="false"></a>
    </div>
    <figcaption>Map pin: open the annotated 3D model view.</figcaption>
  </figure>

  <div class="comm-panorama-area">
    <div class="comm-panorama-stack rep-model-stack" id="rep-model-stack" data-panorama-stack>
      <figure class="comm-panorama rep-model-window">
        <figcaption>Annotated 3D model window</figcaption>
        <div class="comm-panorama-scroll">
          <img class="rep-model-image" src="{{ './img/model-reference-white-v3.svg' | resolvePageAsset(page.url) | toBaseRelative }}?v=20260301d" alt="Annotated 3D architectural model with integrated technical callouts" />
        </div>
      </figure>
    </div>
  </div>
</div>
