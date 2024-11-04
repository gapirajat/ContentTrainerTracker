import React from 'react'

export default function RegisterDob({props}) {
  return (
    <>
          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth<span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                id="dob"
                name="dob"
                type="date"
                required
                value={props.formData.dob}
                onChange={props.handleChange}
                className={`appearance-none block w-full px-4 py-2 border ${
                  props.errors.dob ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm`}
              />
            </div>
            {props.errors.dob && (
              <p className="mt-2 text-sm text-red-600">{props.errors.dob}</p>
            )}
          </div>
    </>
  )
}
