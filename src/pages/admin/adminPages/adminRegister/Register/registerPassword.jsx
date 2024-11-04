import React from 'react'

export default function RegisterPassword({props}) {
  return (
    <>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password<span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={props.formData.password}
                onChange={props.handleChange}
                className={`appearance-none block w-full px-4 py-2 border ${
                  props.errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm`}
                placeholder="********"
              />
            </div>
            {props.errors.password && (
              <p className="mt-2 text-sm text-red-600">{props.errors.password}</p>
            )}
          </div>
    </>
  )
}
