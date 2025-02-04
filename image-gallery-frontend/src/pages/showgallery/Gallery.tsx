const Gallery = () => {
    const username = sessionStorage.getItem('username');
  return (
    <div>
        <h1>Your Memories {username}</h1>
        
        
    </div>
  )
}
export default Gallery