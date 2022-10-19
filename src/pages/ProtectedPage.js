import { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";

function ProtectedPage() {
  const [res, setRes] = useState();
  const api = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/users/");
        var k = response.data
        console.log(k);
        setRes(k);
      } catch {
        setRes("Something went wrong");
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if(res > 1){
        return (
            <div>
                <h1>Projected Page</h1>
                <div className="col">
                    <h1>Mi Casa</h1>
                    <p>This is my house y&apos;all!</p>
                    {res.map(user => <div>{user.email}</div>)}
                </div>
            {/* <p>{res[2].email}</p> */}
            </div>
        );
    }
    else{
        return (
            <div>
                <h1>Projected Page</h1>
                <div className="col">
                    <h1>Mi Casa</h1>
                    <p>This is my house y&apos;all!</p>
                    {res[0].email}
                </div>
            {/* <p>{res[2].email}</p> */}
            </div>
        );
    }
  console.log({res});
}

export default ProtectedPage;