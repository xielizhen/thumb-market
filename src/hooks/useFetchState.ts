import {useCallback, useEffect, useRef, useState} from 'react';

const useFetchState = (props: any) => {
  const focus = useRef(false);
  const [state, setState] = useState(props);

  useEffect(() => {
    focus.current = true;
    return () => {
      focus.current = false
    }
  }, []);
  const setFetchState = useCallback((params: any) => {
    focus.current && setState(params);
  }, []);
  return [state, setFetchState];
}

export default useFetchState