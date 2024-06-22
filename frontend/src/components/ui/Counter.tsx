import { useRecoilState } from "recoil";
import { counterState } from "../../store/CharacterCounter";
import { Button } from "@/components/ui/button";

const Counter = () => {
  const [count, setCount] = useRecoilState(counterState);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
      <Button onClick={() => setCount(count - 1)}>Decrement</Button>
    </div>
  );
};

export default Counter;
