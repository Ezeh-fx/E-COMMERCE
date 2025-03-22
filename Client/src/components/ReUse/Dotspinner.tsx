import { TailSpin } from "react-loader-spinner";
const Dotspinner = () => {
  return (
    <div className="">
      <TailSpin
        visible={true}
        height="35"
        width="35"
        color="white"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Dotspinner;
