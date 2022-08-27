import NoteDisplay from "../../components/NoteDisplay";
import NoteSidebar from "../../components/NoteSidebar";

import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { Button, Container } from "@nextui-org/react";

const getNoteByID = require("../../prisma/Note").getNoteByID;

const getAllNotesByUserID = require("../../prisma/Note").getAllNotesByUserID;

export const getServerSideProps = async ({ req, res, params }) => {
  const session = await getSession({ req });
  console.log({ params });
  const { id } = params;

  if (!session) {
    res.statusCode = 403;
    return { props: { notes: [] } };
  }

  const notes = await getAllNotesByUserID(session?.user?.id);
  console.log({ notes });

  const note = await getNoteByID(id);
  console.log({ note });

  return {
    props: { notes, note },
  };
};

export default function Note({ notes, note }) {
  const { data: session, status } = useSession();
  if (!session) {
    return (
      <>
        Not signed in <br />
        <Button onClick={() => signIn()}>Sign in</Button>
      </>
    );
  }

  return (
    <>
      <Container
        display="flex"
        wrap="nowrap"
        css={{ "min-height": "100vh", padding: "0", margin: "0" }}
      >
        <NoteSidebar notes={notes} />
        <NoteDisplay note={note} css={{ background: "$background" }} />
      </Container>
    </>
  );
}
