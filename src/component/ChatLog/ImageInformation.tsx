import { useCurrentApp } from "@/context/app.context";
import { useSortable } from "@dnd-kit/sortable";
import { Button, Image, UploadFile } from "antd";
import { CSS } from "@dnd-kit/utilities";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { RiDragMove2Fill } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";

interface IProps {
  id: number;
  image: IChatLog;
  index: number;
  fileList: UploadFile[];
  setFileList: (files: UploadFile[]) => void;
}

const ImageInformation = (props: IProps) => {
  const { chatLogImages, setChatLogImages } = useCurrentApp();

  const { id, image, index, fileList, setFileList } = props;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div className="flex gap-4" ref={setNodeRef} style={style}>
      <div className="hidden md:flex justify-center items-center">{index + 1}</div>
      <Button
        className="h-auto"
        type="primary"
        {...attributes}
        {...listeners}
        style={{ touchAction: "none" }}
      >
        <div className="flex flex-col items-center">
          <RiDragMove2Fill className="text-xl" /> <p>Drag</p>
        </div>
      </Button>
      <Image alt="mobile screenshot image" width={100} src={image.imageUrl} preview={true} />
      <div className="h-full w-full flex gap-2">
        <TextArea
          className="h-full"
          showCount
          placeholder={`Image note:\nLimit 30 characters\nFirst messenger chat, First date... (Optional)`}
          rows={4}
          maxLength={30}
          value={image.note} // ✅ Use bracket notation
          onChange={(e) => {
            const newChatLogList = [...chatLogImages];
            newChatLogList[index].note = e.target.value;
            setChatLogImages(newChatLogList);
          }}
        />

        <AiOutlineDelete
          className="cursor-pointer text-lg"
          color="red"
          onClick={() => {
            const fileListFiltered = fileList.filter((item) => item.uid != image.uid);
            setFileList(fileListFiltered);
          }}
        />
      </div>
    </div>
  );
};

export default ImageInformation;
