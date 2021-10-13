
import { useState, useCallback } from "react"

const useForm = (initialValues: { [key: string]: any }  = {}) => {
  const [values, setValues] = useState(initialValues)
  
  const setFieldValue = useCallback((name, value) => {
    setValues((values) => ({
      ...values,
      [name]: value
    }))
  }, [])

  const clearFieldValue = useCallback(() => {
    setValues(initialValues)
  }, [])

  return { values, setFieldValue, clearFieldValue };
}

export default useForm