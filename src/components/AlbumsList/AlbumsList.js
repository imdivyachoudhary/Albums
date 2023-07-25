import { useState, useEffect, useRef } from "react";
import styles from "./AlbumsList.module.css";
import Spinner from "react-spinner-material";

import { toast } from "react-toastify";

import AlbumItem from "./AlbumItem";

function AlbumsList(props) {
  const [albums, setAlbums] = useState([]);
  const [updateAlbum, setUpdateAlbum] = useState(null);
  const [loading, setLoading] = useState(false);

  const albumTitleRef = useRef();

  const getData = async () => {
    setLoading(true);

    //fetch to get all albums
    let res = await fetch("https://jsonplaceholder.typicode.com/albums");
    let data = await res.json();
    // console.log(data);

    setAlbums(data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!updateAlbum) return;
    albumTitleRef.current.value = updateAlbum.title;
  }, [updateAlbum]);

  const clearInput = () => {
    albumTitleRef.current.value = "";
  };

  const createAlbumHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docNew = {
        userId: 1,
        id: albums.length,
        title: albumTitleRef.current.value,
      };

      //fetch to create album
      let res = await fetch("https://jsonplaceholder.typicode.com/albums", {
        method: "POST",
        body: JSON.stringify(docNew),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      let data = await res.json();
      console.log(data);

      setAlbums([data, ...albums]);

      clearInput();

      toast.success("Album created successfully.");
    } catch (error) {
      console.log(error);
      clearInput();
      toast.error("Something went wrong!!!");
    } finally {
      setLoading(false);
    }
  };

  const tosetUpdateAlbum = (album) => {
    setUpdateAlbum(album);
  };

  const updateAlbumHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docNew = {
        userId: updateAlbum.userId,
        id: updateAlbum.id,
        title: albumTitleRef.current.value,
      };

      //fetch to update album
      let res = await fetch(
        "https://jsonplaceholder.typicode.com/albums/" + updateAlbum.id,
        {
          method: "PUT",
          body: JSON.stringify(docNew),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      let data = await res.json();
      console.log(data);

      setUpdateAlbum(null);

      let new_albums = albums.map((album) => {
        if (album.id === data.id) {
          return data;
        } else return album;
      });

      setAlbums(new_albums);

      clearInput();

      toast.success("Album updated successfully.");
    } catch (error) {
      console.log(error);
      setUpdateAlbum(null);
      clearInput();
      toast.error("Something went wrong!!!");
    } finally {
      setLoading(false);
    }
  };

  const deleteAlbumHandler = async (album_id) => {
    setLoading(true);
    try {
      //fetch to delete album
      await fetch(
        "https://jsonplaceholder.typicode.com/albums/" + album_id,
        {
          method: "DELETE",
        }
      );

      let new_albums = albums.filter((album) => album.id !== album_id);

      setAlbums(new_albums);

      toast.success("Album deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!!!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        className={styles.form}
        onSubmit={updateAlbum ? updateAlbumHandler : createAlbumHandler}
      >
        <input
          id="albumTitle"
          className={styles.input}
          type="text"
          placeholder="Album Title"
          ref={albumTitleRef}
          required
        />
        <button className={styles.submitBtn}>
          {updateAlbum ? "Update " : "Add "} Album
        </button>
      </form>
      {loading && (
        <div style={{ width: "100%", display:"flex", justifyContent:"center", alignItems:"center", padding: "20px" }}>
          <Spinner radius={50} color={"#fb607f"} stroke={5} visible={true} />
        </div>
      )}
      <div className="listContainer">
        {albums.map((album) => (
          <AlbumItem
            key={album.id}
            album={album}
            toSetUpdateAlbum={tosetUpdateAlbum}
            deleteAlbumHandler={deleteAlbumHandler}
          />
        ))}
      </div>
    </>
  );
}

export default AlbumsList;
