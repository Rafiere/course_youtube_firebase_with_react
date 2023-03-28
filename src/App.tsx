import React, {useCallback, useEffect, useState} from "react";
import {Auth} from "./components/Auth";
import {firestoredb} from "./config/firebase-config";
import {doc, getDocs, collection, addDoc, deleteDoc, updateDoc} from 'firebase/firestore';
import {Movie} from "./types/movie";
import "./App.css"

const App = () => {

    const [movieList, setMovieList] = useState<Movie[]>([])

    //New Movie States
    const [newMovieTitle, setNewMovieTitle] = useState("")
    const [newMovieReleaseDate, setNewMovieReleaseDate] = useState(0)
    const [isNewMovieReceivedAnOscar, setIsNewMovieReceivedAnOscar] = useState(false)
    const [updatedTitle, setUpdatedTitle] = useState<string>("")

    /* Estamos criando uma referência para essa coleção. (Para a "tabela" no BD) */
    const moviesCollectionRef = collection(firestoredb, "movies");

    const getMovieList = useCallback(async () => {
        try {
            const data = await getDocs(moviesCollectionRef);
            /* O "doc.data()" vai devolver os dados de cada documento, como "receivedAnOscar" e etc, e o
            * "doc.id" retorna o ID de cada documento. */
            const filteredData: Movie[] = data.docs.map((doc) => {
                return ({
                    id: doc.id,
                    title: doc.data().title,
                    releaseDate: doc.data().releaseDate,
                    receivedAnOscar: doc.data().receivedAnOscar
                })
            })
            console.log(filteredData);
            setMovieList(filteredData);
        } catch (err: any) {
            console.error(err.message)
        }
    }, [])

    /* Não podemos ter um "async" dentro do useEffect, assim, temos que declarar a função assíncrona e
    * a chamarmos ao final do useEffect. */
    useEffect(() => {
        getMovieList();
    }, [])

    const createNewMovie = useCallback(async () => {
        try {
            await addDoc(moviesCollectionRef, {
                title: newMovieTitle,
                releaseDate: newMovieReleaseDate,
                receivedAnOscar: isNewMovieReceivedAnOscar
            })
            getMovieList();
        } catch (err: any) {
            console.error(err)
        }

    }, [moviesCollectionRef, newMovieTitle, newMovieReleaseDate, isNewMovieReceivedAnOscar])

    const deleteAMovie = useCallback(async (movieId: string) => {
        try {
            /* Precisamos passar qual é o DB, qual é a collection (tabela) e qual é o ID que queremos deletar. */
            const movieDoc = doc(firestoredb, "movies", movieId)
            await deleteDoc(movieDoc);
        } catch (err: any) {
            console.error(err)
        }
        getMovieList()
    }, [moviesCollectionRef, movieList])

    const updateMovieTitle = useCallback(async (movieId: string) => {
        const movieDoc = doc(firestoredb, "movies", movieId)
        try {
            await updateDoc(movieDoc, {title: updatedTitle})
        } catch (err: any) {
            console.error(err)
        }
        getMovieList()
    }, [movieList, moviesCollectionRef])

    return (
        <div className="App">
            <Auth/>

            <div className="create-movie-container">
                <h1>Create a Movie</h1>
                <input placeholder={"Title..."} onChange={(e) => setNewMovieTitle(e.target.value)}/>
                <input placeholder={"Release Date..."} type={"number"}
                       onChange={(e) => setNewMovieReleaseDate(Number(e.target.value))}/>
                <input type={"checkbox"} checked={isNewMovieReceivedAnOscar}
                       onChange={(e) => setIsNewMovieReceivedAnOscar(e.target.checked)}/>
                <label>Received an Oscar</label>
                <button onClick={createNewMovie}>Submit Movie</button>
            </div>

            <div className={"show-movies-container"}>
                {movieList.map((movie) => {
                    return (
                        <div>
                            <h1>{movie.title}</h1>
                            <p>{"Release date: " + movie.releaseDate}</p>
                            <p>{"Received an oscar: " + movie.receivedAnOscar}</p>
                            <button onClick={() => deleteAMovie(movie.id ?? '')}>Delete Movie</button>
                            <input placeholder={"Set a new title..."} onChange={(e) => setUpdatedTitle(e.target.value)}/>
                            <button onClick={() => updateMovieTitle(movie.id ?? '')}>Update Movie Title</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default App
