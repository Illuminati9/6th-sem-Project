import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from "./highlightText";
import CTAButton from "./ctaButton";
import Banner from "../../assets/Images/banner.mp4";
import CodeBlocks from "./codeBlocks";
import Footer from "./footer";
import TimelineSection from "./timeline";
import LearningLanguageSection from "./learningLanguageSection";

const Home = () => {
  return (
    <div>
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        <Link to={"/signup"}>
          <div className=" group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Login Now</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className="text-center text-4xl font-semibold">
        Empower Your Learning with
        <HighlightText text={"Seamless Assignment Submissions"} />
        </div>

        <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
        With Assignment Similarity Checker, you can learn at your own pace from anywhere, accessing a wealth of resources, including interactive assignments, quizzes, and personalized feedback from instructors, along with AI-powered plagiarism detection.
        </div>

        <div className="mt-8 flex flex-row gap-7">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>

          {/* <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton> */}
        </div>

        <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock your
                <HighlightText text={"learning potential "} />
                with our project and streamline assignment submissions with AI-powered plagiarism detection.
              </div>
            }
            subheading={
              "Our platform is designed for teachers and students within the same college, enabling seamless assignment creation, submission, and AI-powered plagiarism detection for fair evaluations."
            }
            ctabtn1={{
              btnText: "try it yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "learn more",
              linkto: "/login",
              active: false,
            }}
            codeblock={`#include <iostream> 
              using namespace std;
              int main() {
                int arr[] = {1, 2, 3, 4, 5};  
                int size = sizeof(arr) / sizeof(arr[0]);
                int sum = 0;

                for (int i = 0; i < size; i++) {
                    sum += arr[i];
                }

                cout << "The sum of the array elements is: " << sum << endl;
                return 0;
              }`}
            codeColor={"text-yellow-25"}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>
      </div>
      <div className="bg-pure-greys-5 text-richblack-700">
        {/* <div className="homepage_bg h-[320px]">
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-8 ">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                <div>Learn more</div>
              </CTAButton>
            </div>
          </div>
        </div> */}
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
          {/* <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%]">
              Get the skills you need for a{" "}
              <HighlightText text={"Job that is in demand"} />
            </div>

            <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div>Learn more</div>
              </CTAButton>
            </div>
          </div> */}
          <TimelineSection />
          <LearningLanguageSection />
        </div>
    
      </div>
      <Footer />
    </div>
  );
};

export default Home;
