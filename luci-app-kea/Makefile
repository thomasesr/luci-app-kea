include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI support for Kea DHCP
LUCI_DEPENDS:=+luci-base +rpcd +rpcd-mod-ucode +kea-uci +kea-dhcp4 +kea-ctrl +kea-hook-lease-cmds
LUCI_PKGARCH:=all

PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Thomas Richter <thomasesr@gmail.com>

include $(TOPDIR)/feeds/luci/luci.mk

