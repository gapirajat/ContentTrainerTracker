import React from 'react'

export default function RegisterName({props}) {
  return (
    <>
            <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name<span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={props.formData.name}
                onChange={props.handleChange}
                className={`appearance-none block w-full px-4 py-2 border ${
                  props.errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm`}
                placeholder="John Doe"
              />
            </div>
            {props.errors.name && (
              <p className="mt-2 text-sm text-red-600">{props.errors.name}</p>
            )}
          </div>
    </>
  )
}
