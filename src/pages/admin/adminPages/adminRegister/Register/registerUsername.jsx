import React from 'react'

export default function RegisterUsername({props}) {
  return (
    <>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username<span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={props.formData.username}
                onChange={props.handleChange}
                className={`appearance-none block w-full px-4 py-2 border ${
                  props.errors.username ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm`}
                placeholder="uniqueusername"
              />
            </div>
            {props.errors.username && (
              <p className="mt-2 text-sm text-red-600">{eprops.rrors.username}</p>
            )}
          </div>
    </>
  )
}
