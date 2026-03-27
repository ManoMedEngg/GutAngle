def parse_header(line):
    import email.message
    m = email.message.Message()
    m['content-type'] = line
    return m.get_content_type(), m.get_params() or {}
