import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BlogForm from "./BlogForm"

test("create blog form", async () => {
  const mockHandler = jest.fn()
  const user = userEvent.setup()
  render(<BlogForm createBlog={mockHandler} />)

  const title = screen.getByPlaceholderText("title")
  const url = screen.getByPlaceholderText("url")
  const name = screen.getByPlaceholderText("name")
  const btn = screen.getByText("Create Blog")

  await user.type(title, "the title")
  await user.type(name, "yong qin")
  await user.type(url, "www.blog.com")
  await user.click(btn)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0]).toMatchObject({
    title: "the title",
    author: "yong qin",
    url: "www.blog.com",
  })
})
