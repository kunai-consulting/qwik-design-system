import { component$ } from "@builder.io/qwik";
import { Avatar, type AvatarContext } from "@/styled/avatar";
import { Feed } from "@/styled/feed";

export default component$(() => {
  // sample data
  const users = ["Misko", "Patrick"];
  const currStatus = "Todo";
  const prevStatus = "In Progress";
  const timeAgo = " • " + "1 day ago";

  const activityTypes = [
    [
      <FeedAvatar src="https://github.com/mhevery.png" key="history" />,
      <Feed.Text key="history">
        <Feed.Dynamic>{users[0]}</Feed.Dynamic> created the issue {timeAgo}
      </Feed.Text>,
    ],
    [
      <FeedAvatar src="https://github.com/mhevery.png" key="status" />,
      <Feed.Text key="status">
        <Feed.Dynamic>{users[1]}</Feed.Dynamic> changed status from
        <Feed.Dynamic> {prevStatus}</Feed.Dynamic> to
        <Feed.Dynamic> {currStatus}</Feed.Dynamic> {timeAgo}
      </Feed.Text>,
    ],
  ];

  return (
    <Feed.Root>
      <span class="text-2xl">Activity</span>
      {activityTypes.map((activity) => (
        <Feed.Item key={activity.toString()}>{activity}</Feed.Item>
      ))}
    </Feed.Root>
  );
});

type FeedAvatarProps = AvatarContext & {
  src?: string;
};

const FeedAvatar = component$(
  ({ status = "online", size = "small", src, ...props }: FeedAvatarProps) => {
    return (
      <Avatar.Root status={status} size={size} {...props}>
        <Avatar.Image src={src} alt="@mhevery" />
        <Avatar.Fallback>JS</Avatar.Fallback>
        <Avatar.Status />
      </Avatar.Root>
    );
  }
);
