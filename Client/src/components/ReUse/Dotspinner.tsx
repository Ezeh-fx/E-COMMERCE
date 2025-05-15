import { TailSpin } from "react-loader-spinner";
const Dotspinner = () => {
  return (
    <div className="">
      <TailSpin
        visible={true}
        height="30"
        width="30"
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
