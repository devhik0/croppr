import { useVideoPlayer, VideoView } from "expo-video";

export const VideoPlayerComponent = ({ uri }: { uri: string }) => {
  const player = useVideoPlayer(uri as string, (player) => {
    player.loop = true;
  });
  return <VideoView style={{ width: 350, height: 275 }} player={player} allowsFullscreen allowsPictureInPicture />;
};
