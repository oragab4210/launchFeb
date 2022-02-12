import React, { useEffect, useState } from "react";
import styles from "./ProfilePic.module.css";
import useIPFS from "../../../utils/useIPFS";
import { useMutation, useQuery } from "@apollo/client";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import editUserMutation from "../../../GQL/mutations/editUser";
import currentUserQuery from "../../../GQL/queries/CurrentUser";

const ProfilePic = () => {
  const [editUser] = useMutation(editUserMutation);
  const { captureFileAndUploadToIPFS } = useIPFS();
  const [showEditContainer, setShowEditContainer] = useState(true);
  const currentUser = useAppSelector((state) => state.currentUser);
  
  const uploadIPFS_editUser = async (e) => {
    const url = await captureFileAndUploadToIPFS(e);

    editUser({
      variables: { id: currentUser.id, profilePic: url },
      refetchQueries: [{ query: currentUserQuery }],
      awaitRefetchQueries: true,
    }).catch((err) => {
      const errors = err.graphQLErrors?.map((error) => error.message);

      console.log(errors);
    });
  };

  return (
    <div className={styles.container}>
      {currentUser.profilePic ? (
        <img className={styles.pic} src={currentUser.profilePic} alt="" />
      ) : (
        <img
          className={styles.pic}
          src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
          alt=""
        />
      )}

      {showEditContainer ? (
        <div className={styles.onHoverContainer}>
          <label className={styles.fileButtonLabel}>
            <input
              type="file"
              className={styles.fileButton}
              onChange={(e) => uploadIPFS_editUser(e)}
            />
            Edit
          </label>
        </div>
      ) : null}
    </div>
  );
};

export default ProfilePic;
