import React from 'react'
import testimonial1 from '../img/testimonial-1.jpg'
import testimonial2 from '../img/testimonial-2.jpg'
import testimonial3 from '../img/testimonial-3.jpg'
import testimonial4 from '../img/testimonial-4.jpg'
import  OwlCarousel  from 'react-owl-carousel'

import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel/dist/owl.carousel'

function TeachersSwiper () {


  return (
    <div className="container-fluid py-5">
        
    <div className="container py-5">
        <OwlCarousel className="owl-theme" 
        loop margin={10}
                responsive={
                    {
                        0: { items: 1 },
                        600: { items: 2 },
                        1000: { items: 3 }
                    }}
                dots dotsEach
                autoplay={false}
                autoplayTimeout={10000}
                center={true}>
                
            <div className="testimonial-item 
            
            my-4">
                <div className="d-flex  align-items-center border-bottom  pb-4 px-5">
                    <img className="img-fluid rounded" src={testimonial1}  />
                    <div className="ps-4">
                        <h4 className="text-primary mb-1">Client Name</h4>
                        <p className="text-uppercase">Profession</p>
                    </div>
                </div>
                <div className="pt-4 pb-5 px-5">
                    Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam
                </div>
            </div>
            <div className="testimonial-item  my-4">
                <div className="d-flex  align-items-center border-bottom  pb-4 px-5">
                    <img className="img-fluid rounded" src={testimonial2}  />
                    <div className="ps-4">
                        <h4 className="text-primary mb-1">Client Name</h4>
                        <small className="text-uppercase">Profession</small>
                    </div>
                </div>
                <div className="pt-4 pb-5 px-5">
                    Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam
                </div>
            </div>
            <div className="testimonial-item  my-4">
                <div className="d-flex  align-items-center border-bottom  pb-4 px-5">
                    <img className="img-fluid rounded" src={testimonial3}  />
                    <div className="ps-4">
                        <h4 className="text-primary mb-1">Client Name</h4>
                        <small className="text-uppercase">Profession</small>
                    </div>
                </div>
                <div className="pt-4 pb-5 px-5">
                    Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam
                </div>
            </div>
            <div className="testimonial-item   my-4">
                <div className="d-flex  align-items-center border-bottom  pb-4 px-5">
                    <img className="img-fluid rounded" src={testimonial4} />
                    <div className="ps-4">
                        <h4 className="text-primary mb-1">Client Name</h4>
                        <small className="text-uppercase">Profession</small>
                    </div>
                </div>
                <div className="pt-4 pb-5 px-5">
                    Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam
                </div>
            </div>
        </OwlCarousel>
    </div>
</div>
  )
}

export default TeachersSwiper