require "spec_helper"

RSpec.describe Protorepo::Segment do
  it "has a version number" do
    expect(Protorepo::Segment::VERSION).not_to be nil
  end

  it "does something useful" do
    expect(false).to eq(true)
  end
end
