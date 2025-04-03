import { useCurrentApp } from "@/context/app.context";
import { useSortable } from "@dnd-kit/sortable";
import { Button, Image, Modal } from "antd";
import { CSS } from "@dnd-kit/utilities";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { RiDragMove2Fill } from "react-icons/ri";

interface IProps {
  id: number;
  image: IChatLog;
  index: number;
}

const ImageInformation = (props: IProps) => {
  const { chatLogImages, setChatLogImages } = useCurrentApp();

  const { id, image, index } = props;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div className="flex gap-4" ref={setNodeRef} style={style}>
      <div className="flex justify-center items-center">{index + 1}</div>
      <Button className="h-auto" type="primary" {...attributes} {...listeners}>
        <div className="flex flex-col items-center">
          <RiDragMove2Fill className="text-xl" /> <p>Drag</p>
        </div>
      </Button>
      <Image alt="" width={100} src={image.imageUrl} preview={true} />
      <TextArea
        showCount
        placeholder={`Image note:\nLimit 40 characters\nFirst messenger chat, First date... (Optional)`}
        rows={4}
        maxLength={30}
        value={image.note} // ✅ Use bracket notation
        onChange={(e) => {
          const newChatLogList = [...chatLogImages];
          newChatLogList[index].note = e.target.value;
          setChatLogImages(newChatLogList);
        }}
      />
    </div>
  );
};

export default ImageInformation;
