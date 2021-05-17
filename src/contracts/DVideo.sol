pragma solidity >=0.4.22 <0.9.0;

contract DVideo {
  uint public videoCount = 0;
  uint public commentCount = 0;
  uint public zero = 0;
  string public name = "DVideo";
  Comment[] public emptyTab;

  mapping(uint => Video) public videos;
  mapping(uint => Comment) public comments;
  mapping (string => Video) public videoByHash;
  mapping(string => mapping(uint => string)) public videoComments;

  struct Video {
    uint id;
    string hash;
    string title;
    address author;
    uint commentCount; 
  }

  struct Comment {
    uint id;
    string hasVideo;
    address author; 
    string comment;
  }

  event VideoUploaded(
    uint id,
    string hash,
    string title,
    address author
  );



  constructor() public {
  }

  function uploadVideo(string memory _videoHash, string memory _title) public {
    // Make sure the video hash exists
    require(bytes(_videoHash).length > 0);
    // Make sure video title exists
    require(bytes(_title).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Increment video id
    videoCount ++;

    // Add video to the contract
    videos[videoCount] = Video(videoCount, _videoHash, _title, msg.sender, zero);
    videoByHash[_videoHash] = Video(videoCount, _videoHash, _title, msg.sender, zero);
    // Trigger an event
    emit VideoUploaded(videoCount, _videoHash, _title, msg.sender);
  }

  function addComment(string memory _videoHash, string memory _comment) public {
      commentCount++;
      videoByHash[_videoHash].commentCount++;
      comments[commentCount] = Comment(commentCount, _videoHash, msg.sender, _comment);
     // videoByHash[_videoHash].idComments.push(comments[commentCount]);
      
      videoComments[_videoHash][videoByHash[_videoHash].commentCount] = _comment;

      emit VideoUploaded(videoCount, _videoHash, "hello", msg.sender);
  }
}
















/*
contract DVideo {

 uint public VideoCommentCount = 0;
  uint public CommentCount = 0;
  uint public videoCount = 0;
  string public name = "DVideo";
   uint[] public emptyTab = [0];
  //Create id=>struct mapping
  mapping (uint => Video) public videos;

  mapping (uint => Comment) public comments;
  mapping(uint )

  // mapping (string => mapping (uint => Comment)) public videoComments;

  //Create Struct
struct Video{
  uint id;
  string hash;
  string title;
  address author;
  uint[] idComments; 

}

struct Comment {
  uint id;
  string comment;
  string hashVideo;
  uint idVideo;
  address author;
}

event VideoUploaded(
  uint id,
  string hash,
  string title,
  address author
);

event NewComment (
  uint id,
  string comment,
  string hashVideo,
  uint idVideo,
  address author
  
);
  //Create Event


  

  function uploadVideo(string memory _videoHash, string memory _title) public {
    // Make sure the video hash exists
    require(bytes(_videoHash).length > 0 );
    // Make sure video title exists
    require(bytes(_title).length > 0 );
    // Make sure uploader address exists
    require(msg.sender != address(0));

    // Increment video id
      videoCount++;
    // Add video to the contract
   
      videos[videoCount] = Video(videoCount, _videoHash, _title, msg.sender, emptyTab );

    // Trigger an event
emit VideoUploaded(videoCount, _videoHash, _title, msg.sender);


  }


  function uploadComment(string memory _videoHash, string memory _comment, uint _idVideo) public {

    CommentCount++;
    comments[CommentCount] = Comment(CommentCount, _videoHash, _comment, _idVideo, msg.sender);
    emit NewComment(CommentCount, _videoHash, _comment,_idVideo, msg.sender);

    videos[_idVideo].idComments.push(CommentCount);

  }

/*
    function addVideoComment(string memory _hashVideo, string memory _comment) public {
       
       // VideoCommentCount = videoComments.length;
    
   //if(videoComments[_hashVideo][0].exists){}
        VideoCommentCount = 0;
        videoComments[_hashVideo][VideoCommentCount] = Comment(CommentCount, _hashVideo, _comment, msg.sender);

        emit NewComment(CommentCount, _hashVideo, _comment, msg.sender);
    }


  constructor() public {

  }
}
*/