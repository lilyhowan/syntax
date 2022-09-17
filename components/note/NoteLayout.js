import NoteDisplay from ".//NoteDisplay";
import NoteSidebar from "./NoteSidebar";
import NoteNavbar from "./NoteNavbar";
import { Container } from "@nextui-org/react";
import { useState } from "react";
import {
  useNote,
  useDispatchNote,
  useNotes,
  useDispatchNotes
} from "@/modules/AppContext";

const NoteLayout = ({ allNotes, currentNote }) => {
  const [sidebarDisplay, setSidebarDisplay] = useState(false);

  const handleSidebarDisplay = () => {
    setSidebarDisplay((current) => !current);
  };

  return (
    <Container
      fluid
      display="flex"
      wrap="nowrap"
      css={{
        "min-width": "100vw",
        "min-height": "100vh",
        padding: "0",
        margin: "0"
      }}
    >
      <NoteSidebar
        notes={allNotes}
        sidebarDisplay={sidebarDisplay}
        handleSidebarDisplay={handleSidebarDisplay}
      />
      <Container
        display="flex"
        direction="column"
        wrap="nowrap"
        css={{
          padding: "0",
          margin: "0",
          "max-height": "100vh",
          "max-width": "100vw",
          "overflow-y": "auto"
        }}
      >
        <NoteNavbar
          sidebarDisplay={sidebarDisplay}
          handleSidebarDisplay={handleSidebarDisplay}
        />
        <Container
          css={{
            padding: "0",
            "min-width": "100%",
            "overflow-y": "scroll",
            "overflow-x": "hidden"
          }}
        >
          <NoteDisplay note={currentNote} key={currentNote} />
        </Container>
      </Container>
    </Container>
  );
};

export default NoteLayout;
