import React, { Component } from 'react';
import DVideo from '../abis/DVideo.json'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = DVideo.networks[networkId]
    if(networkData) {
      const dvideo = new web3.eth.Contract(DVideo.abi, networkData.address)
      this.setState({ dvideo })
      const videosCount = await dvideo.methods.videoCount().call()
      this.setState({ videosCount })

      

      // DEBUT TEST 

      // Load videos, sort by newest
      for (var i=videosCount; i>=1; i--) {
        const video = await dvideo.methods.videos(i).call()
        this.setState({
          videos: [...this.state.videos, video]
        })
      }

      //Set latest video with title to view as default 
      const latest = await dvideo.methods.videos(videosCount).call()
      this.setState({
        currentHash: latest.hash,
        currentTitle: latest.title
      })

  // SET COMMENTS OF CURRENT VIDEO

  const commentCount = await dvideo.methods.videoByHash(this.state.currentHash).call();
  const newCount = parseInt(commentCount.commentCount);

console.log('lol', newCount)
  for (var i= 1; i < (newCount + 1) ; i++) {
    console.log('ok')
    const commentsVideo = await dvideo.methods.videoComments(this.state.currentHash,i).call()
    this.setState({
      commentsVideo: [...this.state.commentsVideo, commentsVideo]
    })
   
  }


  /*
  const videoCommentss = await dvideo.methods.videoComments(this.state.currentHash, 1).call();
  console.log("video Comments -> ", videoCommentss);
  */
   
  /*this.setState({
      currentComments : videoByHash.idComments
    })*/



    //console.log("idComments -> ", this.state.currentComments);
      this.setState({ loading: false})
    } else {
      window.alert('DVideo contract not deployed to detected network.')
    }


  }



  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  refreshPage = () => {
    document.location.reload();
  }

  addComment = comment => {
 
      this.setState({ loading: true })

      this.state.dvideo.methods.addComment(this.state.currentHash, comment).send({ from: this.state.account }).on('transactionHash', (hash) => {
       
       
        this.setState({ loading: false })
      })


      this.state.dvideo.events.VideoUploaded().on("data", function(){
        document.location.reload();
      })
   
  }

  uploadVideo = title => {
    console.log("Submitting file to IPFS...")

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS result', result)
      if(error) {
        console.error(error)
        return
      }


      this.setState({ loading: true })
      this.state.dvideo.methods.uploadVideo(result[0].hash, title).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
      this.state.dvideo.events.VideoUploaded().on("data", function(){
        document.location.reload();
      })
    })
  }

  changeVideo = async (hash, title) => {
    this.setState({'currentHash': hash});
    this.setState({'currentTitle': title});
    document.getElementsByClassName('div_all_comments')[0].innerHTML = "";
    const commentCount = await this.state.dvideo.methods.videoByHash(this.state.currentHash).call();
  const newCount = parseInt(commentCount.commentCount);

console.log('lol', newCount)
  for (var x= 1;  x < (newCount + 1) ; x++) {
    console.log('ok')
    const commentsVideo = await this.state.dvideo.methods.videoComments(this.state.currentHash,x).call()
    this.setState({
      commentsVideo: [...this.state.commentsVideo, commentsVideo]
    })
   
  }

    
  }

 

  constructor(props) {
    super(props)
    this.state = {
      buffer: null,
      account: '',
      dvideo: null,
      videos: [],
      commentsVideo: [],
      loading: true,
      currentHash: null,
      currentTitle: null
    }

    this.uploadVideo = this.uploadVideo.bind(this)
    this.addComment = this.addComment.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.changeVideo = this.changeVideo.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar 
          account={this.state.account}
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              videos={this.state.videos}
              commentsVideo = {this.state.commentsVideo}
              uploadVideo={this.uploadVideo}
              addComment = {this.addComment}
              captureFile={this.captureFile}
              changeVideo={this.changeVideo}
              currentHash={this.state.currentHash}
              currentTitle={this.state.currentTitle}
            />
        }
      </div>
    );
  }
}

export default App;