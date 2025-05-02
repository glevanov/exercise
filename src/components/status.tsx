interface StatusProps {
  text: string;
}

export const Status = ({ text }: StatusProps) => {
  return (
    <p>
      Currently doing:
      <br />
      {text}
    </p>
  );
};
