import React from "react";
import pic1 from "@/public/guide/1.jpg";
import pic2 from "@/public/guide/2.jpg";
import pic3 from "@/public/guide/3.jpg";
import pic4 from "@/public/guide/4.jpg";
import pic5 from "@/public/guide/5.jpg";
import pic6 from "@/public/guide/6.jpg";
import pic7 from "@/public/guide/7.jpg";
import pic8 from "@/public/guide/8.jpg";
import pic9 from "@/public/guide/9.jpg";
import pic10 from "@/public/guide/10.jpg";
import pic11 from "@/public/guide/11.jpg";
import pic12 from "@/public/guide/12.jpg";
import Image from "next/image";

function Guide() {
  return (
    <>
      <div className="mb-5">
        <p>
          1/ In your facebook page, at top right icon, you can access the drop downdown menu by
          clicking it.
        </p>
        <Image src={pic1} alt="" className="mx-auto mt-3" />
      </div>
      <div className="mb-5">
        <p>2/ Click on "Setting & privacy"</p>
        <Image src={pic2} alt="" className="mx-auto mt-3" />
      </div>
      <div className="mb-5">
        <p>3/ Click on "Download your information"</p>
        <Image src={pic3} alt="" className="mx-auto mt-3" />
      </div>
      <div className="mb-5">
        <p>4/ Facebook will take you to another page </p>
        <Image src={pic4} alt="" className="mx-auto mt-3" />
      </div>
      <div className="mb-5">
        <p>5/ Click on "Download or transfer information" </p>
        <Image src={pic5} alt="" className="mx-auto mt-3" />
      </div>
      <div className="mb-5">
        <p>6/ Choose Facebook and then Next </p>
        <Image src={pic6} alt="" className="mx-auto mt-3" />
      </div>
      <div className="mb-5">
        <p>7/ Click on "Specific types of information" </p>
        <Image src={pic7} alt="" className="mx-auto mt-3" />
      </div>
      <div className="mb-5">
        <p>8/ It will show all lists you can download, but only choose "Messages" </p>
        <Image src={pic8} alt="" className="mx-auto mt-3" />
      </div>
      <div className="mb-5">
        <p>9/ Choose whichever you want to save the file </p>
        <Image src={pic9} alt="" className="mx-auto mt-3" />
      </div>
      <div className="mb-5">
        <p>
          10/ This is important, please choose <span className="font-bold">Format: JSON</span> and{" "}
          <span className="font-bold">Media quality: Low</span>
        </p>
        <Image src={pic10} alt="" className="mx-auto mt-3" />
      </div>
      <div className="mb-5">
        <p>
          11/ You will need to wait some time depend on how big your file is. After you download the
          file and extract it, it will be something like this
        </p>
        <Image src={pic11} alt="" className="mx-auto mt-3" />
      </div>
      <div className="mb-5">
        <p>12/ Please follow this path to access your JSON file</p>
        <ul>
          <li>/your_facebook_activity</li>
          <li>/messages</li>
          <li>/inbox</li>
          <li>/messenger name (example: kssf_3333222060082022)</li>
          <li>The JSON file will be found here</li>
        </ul>
        <Image src={pic12} alt="" className="mx-auto mt-3" />
      </div>
    </>
  );
}

export default Guide;
