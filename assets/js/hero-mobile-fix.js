/* Force hero background fit on mobile without affecting desktop.
   Works whether background is applied on .hero-bg or on the slide element itself. */
(function(){
  function apply(){
    var isMobile = window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
    var bgEls = document.querySelectorAll(".hero-bg, .hero-slide, .hero-card, #hero .slide, .hero .slide");
    bgEls.forEach(function(el){
      // Only touch elements that actually have a background-image set
      var bg = null;
      if(el && el.style && el.style.backgroundImage) bg = el;
      if(!bg){
        var cs = window.getComputedStyle(el);
        if(cs && cs.backgroundImage && cs.backgroundImage !== "none"){
          bg = el;
        }
      }
      if(!bg) return;

      if(isMobile){
        bg.style.backgroundSize = "contain";
        bg.style.backgroundPosition = "center center";
        bg.style.backgroundRepeat = "no-repeat";
        if(!bg.style.backgroundColor) bg.style.backgroundColor = "#f3f4f6";
      }else{
        // desktop unchanged: clear what we forced on mobile.
        bg.style.backgroundSize = "";
        bg.style.backgroundPosition = "";
        bg.style.backgroundRepeat = "";
        // keep backgroundColor as-is
      }
    });
  }

  document.addEventListener("DOMContentLoaded", apply);
  window.addEventListener("resize", apply);
  window.addEventListener("orientationchange", apply);
})();
