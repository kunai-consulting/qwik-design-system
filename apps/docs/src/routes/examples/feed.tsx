import { component$, Slot } from "@builder.io/qwik";
import { Avatar, type AvatarContext } from "@/styled/avatar";
import { Feed } from "@/styled/feed";
import { LuTag } from "@qwikest/icons/lucide";

const ticketData = {
  users: ["Misko", "Jack"],
  currStatus: "Todo",
  prevStatus: "In Progress",
  timeAgo: "1 day ago",
  labels: ["Release", "Bug"],
  comments: ["LGTM - Approved"],
};

const { users, currStatus, prevStatus, timeAgo, labels, comments } = ticketData;

export default component$(() => {
  const history = [
    <FeedAvatar
      src="https://github.com/mhevery.png"
      key="history"
      alt="Misko Hevery Profile"
      status="offline"
    >
      <Avatar.Fallback>MH</Avatar.Fallback>
    </FeedAvatar>,
    <Feed.Text key="history">
      <Feed.Dynamic>{users[0]}</Feed.Dynamic> created the issue • {timeAgo}
    </Feed.Text>,
  ];

  const status = [
    <FeedAvatar
      status="online"
      src="https://i.imgur.com/rVyLbyc.png"
      key="status"
      alt="Jack Shelton Profile"
    />,
    <Feed.Text key="status">
      <Feed.Dynamic>{users[1]}</Feed.Dynamic> changed status from
      <Feed.Dynamic> {prevStatus}</Feed.Dynamic> to
      <Feed.Dynamic> {currStatus}</Feed.Dynamic> • {timeAgo}
    </Feed.Text>,
  ];

  const label = [
    <FeedAvatar key="label">
      <Avatar.Content class="bg-transparent">
        <LuTag />
      </Avatar.Content>
    </FeedAvatar>,
    <Feed.Text key="label">
      <Feed.Dynamic>{users[1]}</Feed.Dynamic> added label
      <Feed.Dynamic> • {labels[0]}</Feed.Dynamic>
    </Feed.Text>,
  ];

  const activityTypes = [history, status, label];

  return (
    <Feed.Root>
      <span class="text-2xl">Activity</span>
      {activityTypes.map((activity) => (
        <Feed.Item key={activity.toString()}>{activity}</Feed.Item>
      ))}
      <Comments />
    </Feed.Root>
  );
});

type FeedAvatarProps = AvatarContext & {
  src?: string;
  alt?: string;
};

const FeedAvatar = component$(
  ({ status, size = "small", src, alt, ...props }: FeedAvatarProps) => {
    return (
      <Avatar.Root status={status} size={size} {...props}>
        <Avatar.Image hidden={!src} src={src} alt={alt} />
        {status && <Avatar.Status />}
        <Slot />
      </Avatar.Root>
    );
  }
);

const Comments = component$(() => {
  return (
    <>
      {/* Pretend this maps over a list of comments */}
      <div class="min-h-20 bg-slate-900 rounded-md p-4 border-slate-800 border">
        <div class="flex gap-4 mb-4 items-center">
          <FeedAvatar
            src="https://github.com/mhevery.png"
            alt="Misko Hevery Profile"
            status="offline"
          >
            <Avatar.Fallback>MH</Avatar.Fallback>
          </FeedAvatar>
          <div>
            {users[0]} • {timeAgo}
          </div>
        </div>
        <div>{comments[0]}</div>
      </div>

      <textarea
        class="w-full min-h-20 rounded-md p-4 bg-slate-900 border-slate-800 border resize-none outline-none"
        placeholder="Leave a comment..."
      />
    </>
  );
});
